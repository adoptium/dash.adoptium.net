const Bundler = require('parcel-bundler')
const express = require('express')

const bundler = new Bundler('index.html')
const app = express()

app.use(bundler.middleware())

app.listen(Number(process.env.PORT || 3000))
