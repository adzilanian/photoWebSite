const httpStatus = require('http-status-codes')
const dotenv = require('dotenv')
const path = require("path")

const http = require('http')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')

const express = require("express")

const router = express.Router()
const app = express()

const jsonRPC = require('./jsonRPC')

/*
 * --------------------------
 * Express Server Config
 * --------------------------
 */
dotenv.config()
const PORT = process.env.SERVER_PORT || 4200

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  //console.log("++++ SERVERLOG :", req.protocol + '://' + req.get('host') + req.originalUrl)
  next()
})

app.use(bodyParser.urlencoded({ extended: true }));

app.disable('x-powered-by');

app.set("view engine", "pug")
app.set("views", path.join(__dirname, "views"))

app.use('/public', express.static(path.join(__dirname, 'public')))

app.use("/", router)

http.createServer(app).listen(PORT, () => {
  console.log("NodeJS HTTP Express Server started ==> PORT: ", PORT)
})

/*
 * -------------------------------
 * DB Template Fixed Text
 * -------------------------------
 */
let title = process.env.PAGE_TITLE
let footerYear = `&copy; ${new Date().getFullYear()} Deutsche Bahn AG`

/*
 * FIXED Text Elements
 */

let mainTitle = title
let mainContent = "Anwendung wird gestarted..."
let boxLeftTitle = "Public DID"
let boxLeftContent = `<ul><li><a href='${process.env.PUBLIC_DID_URL}'>${process.env.PUBLIC_DID}</a></li></ul>`
let boxCenterTitle = "API SWAGGER"
let boxCenterContent = `<ul><li><a target='_blank' href='${process.env.ASSET}'>API Documentation</a></li></ul>`
let boxRightTitle2 = 'RailChain mFund Project'
let boxRightContent2 = "<p><a href='https://railchain.berlin'><img src='https://railchain.berlin/images/logo.png' width='200' heigth='200' /></a></p>"
let boxRightTitle = "RailChain Consortial Partner"
let boxRightContent = "<p><a href='https://railchain.berlin'><img src='https://railchain.berlin/images/konsortium.png' width='300' heigth='300' /></a></p>"

/*
 * Form Input Elements
 */

let msgCreate = ''

/*
 * Environment Variables (Agent Asset & Agent Pilot)
 */
let asset = process.env.ASSET

/*
 * -------------------------------
 * Path : Index - Welcome
 * -------------------------------
 */
router.get("/", (req, res) => {

  mainTitle = title
  mainContent = "<b>Starting API Request...</b>"

  fetch(asset + "/credentials", {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'x-api-key' : 'drom'
    },
  }).then(async (result) => {
      let dataJSON = await result.json()
      mainContent = JSON.stringify(dataJSON, null, 2)
      console.log(dataJSON.results)
      res.status(httpStatus.OK)
      res.render("db_send", {
        api_result: dataJSON,
        title: title,
        footerYear: footerYear,
        mainTitle: title,
        mainContent: mainContent,
        boxLeftTitle: boxLeftTitle,
        boxLeftContent: boxLeftContent,
        boxCenterTitle: boxCenterTitle,
        boxCenterContent: boxCenterContent,
        boxRightTitle: boxRightTitle,
        boxRightContent: boxRightContent,
        boxRightTitle2: boxRightTitle2,
        boxRightContent2: boxRightContent2,
        })

      })
      .catch(err => {
        console.error(err)

        mainContent = err

        //res.send(err.message)

        res.status(httpStatus.OK)
        res.render("db_send", {
          api_result: mainContent,
          title: 'Credentials',
          footerYear: footerYear,
          mainTitle: 'Credentials',
          mainContent: mainContent,
          boxLeftTitle: boxLeftTitle,
          boxLeftContent: boxLeftContent,
          boxCenterTitle: boxCenterTitle,
          boxCenterContent: boxCenterContent,
          boxRightTitle: boxRightTitle,
          boxRightContent: boxRightContent
        })

      })
})

/*
 * -------------------------------
 * Path : 404 - Not found Info
 * -------------------------------
 */
app.use(function(req, res, next) {
  if(req.accepts('html') && res.status(httpStatus.NOT_FOUND)) {

    mainTitle = "Fehler 404 - Die Seite wurde nicht gefunden"
    mainContent = "<div class='imgpos'><img class='img404' src='/public/images/404.png'/></div>"

    //setBoxContent(itxt)

    res.status(httpStatus.NOT_FOUND)
    res.render("db_template", {
      title: title,
      footerYear: footerYear,
      mainTitle: mainTitle,
      mainContent: mainContent,
      boxLeftTitle: boxLeftTitle,
      boxLeftContent: boxLeftContent,
      boxCenterTitle: boxCenterTitle,
      boxCenterContent: boxCenterContent,
      boxRightTitle: boxRightTitle,
      boxRightContent: boxRightContent
    })

  }
})
