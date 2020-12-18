var express = require("express")
var hbs = require('express-handlebars')
var path = require("path")
var formidable = require("formidable")
var app = express()
const PORT = 3000
app.set('views', path.join(__dirname, 'views'))                                                        // ustalamy katalog views
app.engine('hbs', hbs({ defaultLayout: 'index.hbs', extname: '.hbs', partialsDir: 'views/partials' }))   // domyślny layout, nazwa rozszerzenia oraz miejsce partiali
app.set('view engine', 'hbs')                                                                          // określenie nazwy silnika szablonów

var tab = []
var id = 0

app.get("/", function (req, res) {
    res.render('upload.hbs')
})

app.get("/upload", function (req, res) {
    res.render('upload.hbs')
})

app.get("/files", function (req, res) {
    res.render('files.hbs', { tab })
})

app.get("/info", function (req, res) {
    res.render('info.hbs')
})

app.post('/handleUpload', function (req, res) {
    var form = new formidable.IncomingForm()
    form.uploadDir = __dirname + '/static/upload/'       // folder do zapisu zdjęcia
    form.keepExtensions = true                           // zapis z rozszerzeniem pliku
    form.multiples = true                                // zapis wielu plików                          
    form.parse(req, function (err, fields, files) {
        if (Array.isArray(files.fileToUpload)) {
            files.fileToUpload.forEach((file) => {
                id += 1
                console.log(files)
                var img = file.name.substr(file.name.indexOf('.') + 1)
                tab.push({ id: id, imagePath: `gfx/${img}.png`, name: file.name, size: file.size, type: file.type, generatedName: path.basename(file.path), date: new Date().getTime(), path: file.path })
            })
        }
        else {
            id += 1
            console.log(files)
            var img = files.fileToUpload.name.substr(files.fileToUpload.name.indexOf('.') + 1)
            tab.push({ id: id, imagePath: `gfx/${img}.png`, name: files.fileToUpload.name, size: files.fileToUpload.size, type: files.fileToUpload.type, generatedName: path.basename(files.fileToUpload.path), date: new Date().getTime(), path: files.fileToUpload.path })

        }
    })
    res.redirect("/files")
})

app.get("/deleteA", function (req, res) {
    tab.splice(0, tab.length)
    res.redirect('/files')
})

app.get("/delete:p", function (req, res) {
    for (let i = 0; i < tab.length; i++) {
        if (tab[i].id == req.params.p) {
            tab.splice(i, 1)
        }
    }
    res.redirect('/files')
})

app.get("/info:p", function (req, res) {
    for (let i = 0; i < tab.length; i++) {
        if (tab[i].id == req.params.p) {
            var info = tab[i]
            res.render("info.hbs", { info })
        }
    }
})

app.listen(PORT, function () {
    console.log("Server działa na porcie : " + PORT)
})

app.use(express.static("static"))


