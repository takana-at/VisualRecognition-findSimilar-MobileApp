# VisualRecognition-findSimilar-MobileApp

Watson Visual Recognitionサービスを使った類似画像検索を使ったデモです。





## 実装手順

1. Bluemixのカタログ画面から、Virtual Recognitionサービスを作成し、サービスの{api_key}をメモしておきます。
2. Virtual Recognitionサービス上にcollection を作成し、{collection_id}をメモしておきます。  
  このcollectionに、類似画像検索のトレーニングデータの画像を登録します。
3. githubのvrAppのコードをダウンロードします。
4. コードをインストール後、 config.jsファイルを開き、{api_key} と {collection_id}を、先ほどメモした{api_key} と {collection_id}に変更します。
5. 変更したコードをBluemix上にデプロイします。  
  コマンドプロンプトで下記を順に実行します。
　①cf login -a https://api.ng.bluemix.net  
 　(Bluemixにログインします。今回は米国南部にデプロイする前提で書いてあります。)  
　②Bluemixに登録してあるEmailを入力します。  
　③Bluemixに登録してあるPasswordを入力します。  
　④Bluemix上に組織、スペースを複数作成している場合は、アプリをデプロイする組織、スペースを選択します。  
　⑤cf push {アプリ名}  
 　(任意のアプリ名を設定し、アプリをデプロイします。)


## ファイル構成
    vrApp  
     |-node-modules  
     |-public  
     |  index.ejs  (写真選択後に遷移する画面)  
     |-views  
        |-index.html  (top画面)  
        |-stylesheets  
           |-result.css  (index.ejsのCSS)  
           |-style.css  (index.htmlのCSS)  
     |-app.js  (類似画像検索をwebで実装します。)  
     |-config.js  (vitual recognitionサービスの認証情報を設定します。)  
     |-package.json  
     |-README.md  
     |-.gitignore
     
## 注意点
・eclipseで、コードを編集する場合には、下記のURLを参考にして、nodeclipseプラグインをインストールしてください。  
http://qiita.com/suesan/items/7f2c4863feb87a623517
