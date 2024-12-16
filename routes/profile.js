const path = require('path');
var express = require('express');
var router = express.Router();
const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Indikatu irudiak uploads/ karpetan gordetzea
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Fitxategiaren izena: <fieldname>-<timestamp>-<random>.<extension>
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname); // Jatorrizko luzapena mantendu
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
});

function fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase(); // Obtener extensión
    if (ext == '.png'  || ext == '.jpg') {
        cb(null, true); // Aceptar si es  
    }
    else{
        return cb(new Error('Solo se permiten archivos PNG o JPG. Tu archivo es: ' + ext))
    }   
}

  const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: fileFilter
  })
  const uploadFields = upload.fields([
    { name: 'avatar', maxCount: 1 } // Acepta solo 1 archivo en el campo 'avatar'
]);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('form.html');
});

router.post('/', upload.single('avatar'), function (req, res, next) {
    console.log(req.file)
    const imageUrl = 'http://localhost:3000'+`/uploads/${req.file.filename}`;
    console.log("URL:"+imageUrl)
    const userName = req.body.name;

    res.send(`Zure izena: ${userName}. Fitxategia: <a href="${imageUrl}" alt="User avatar">${imageUrl}</a>`);
})


module.exports = router;
