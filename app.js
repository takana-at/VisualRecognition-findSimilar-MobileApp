var express = require('express');
var app = express();
var config = require('./config');
var cfenv = require('cfenv');
var ejs = require('ejs');
var fs = require('fs');
var template = fs.readFileSync(__dirname + '/public/index.ejs','utf-8');
var multer = require('multer');
var watson = require('watson-developer-cloud');
var easyimg = require('easyimage');
app.use(multer({dest:"./uploads/"}).single("img_set"));
app.use(express.static(__dirname + '/views'));
var FormData = require('form-data');

var cf_port = cfenv.getAppEnv();

var visual_recognition = watson.visual_recognition({
	api_key:config.service_api_key,
	version:'v3',
	version_date:'2016-05-20'
});

/*	類似画像検索機能の実装	*/
app.post('/findSimilar',function(req,res){
	var srcpath = req.file.path;
	var dstpath = req.file.path + req.file.originalname;

//	//detect face 未実装
//	var params = {
//			url:fs.createReadStream(srcpath)
//		};
//	visual_recognition.detectFaces(params,function(err,response){
//		if(err){
//			console.log(err);
//		}else{
//			console.log(response);
//		}
//	});

////. リサイズ
	easyimg.rescrop({
	     src:srcpath, dst:dstpath,
		    width:300
		 }).then(
		 function (image) {
						var params = {
								collection_id:config.service_collection,
								image_file:fs.createReadStream(dstpath), //req.file.path+"_resize_img"),
								limit:20
							};
							visual_recognition.findSimilar(params,function(err,response){

								fs.unlink(srcpath,function(err){});
								fs.unlink(dstpath,function(err){});
								
								if(err)
									console.log(err);
								else{
									var data = [];
									var show_data = [];
									var num = 0;
									
									for(var i = 0; i < response.similar_images.length; i++){
										var person_name = response.similar_images[i].metadata.name;
										var person_imgurl = response.similar_images[i].metadata.img_url;
										var person_imgid = response.similar_images[i].image_id ;
										var person_score = response.similar_images[i].score;
										console.log("person_imgurl" + person_imgurl);
										
										/*	類似画像検索の結果で、人物の重複がないかチェック	*/
										var name_check;
										var found = false;
										for(var j = 0; j < i && !found; j++){
											name_check = response.similar_images[j].metadata.name;
											if(person_name == name_check){
												found = true;
											}
										}
						
										if(found == false && num < 3){
											data.push({name:person_name,score:Math.round(person_score*100),/*	imgid:person_imgid	,*/imgUrl:person_imgurl});
											num++;
										}
									}	
									var html = ejs.render(template,{info:data});
									res.write(html);
									res.end();
								}
							});	

				 },
		 function(err) {
		
			var params = {
				collection_id:config.service_collection,
				image_file:fs.createReadStream(dstpath), 
				limit:20
			};
			visual_recognition.findSimilar(params,function(err,response){

				fs.unlink(srcpath,function(err){});
				fs.unlink(dstpath,function(err){});
				
				if(err)
					console.log(err);
				else{
					var data = [];
					var show_data = [];
					var num = 0;
					
					for(var i = 0; i < response.similar_images.length; i++){
						console.log( response.similar_images[i].metadata );

						var person_name = response.similar_images[i].metadata.name;
						var person_imgurl = response.similar_images[i].metadata.img_url;
						var person_imgid = response.similar_images[i].image_id ;
						var person_score = response.similar_images[i].score;
						
						/*	類似画像検索の結果で、人物の重複がないかチェック	*/
						var name_check;
						var found = false;
						for(var j = 0; j < i && !found; j++){
							name_check = response.similar_images[j].metadata.name;
							if(person_name == name_check){
								found = true;
							}
						}
		
						if(found == false && num < 3){
							data.push({name:person_name,score:Math.round(person_score*100),/*	imgid:person_imgid	,*/imgUrl:person_imgurl});
							num++;
						}
					}
					var html = ejs.render(template,{info:data});
					res.write(html);
					res.end();
				}
			});	
		}
	);		
});

//app.listen(2000);
//Cloud Foundry port
app.listen(cf_port.port);
console.
log("started");
console.log("cf_port.port =" + cf_port.port);
