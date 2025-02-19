import axios from "axios";
import  express from "express";
import request from "request";
import fs from "fs";
import FormData from "form-data";
import multer from "multer"
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

app.get('/',(req,res)=>{
    res.render('index.ejs');
})

let data = new FormData();

app.use(express.json());

app.set('view engine', 'ejs');

app.use('/public', express.static(path.join(__dirname, 'public')));

let code;
app.get('/check',(req,res)=>{

    res.render('checkyourburn.ejs');
})

app.get('/thermal',(req,res)=>{

  res.render('thermal.ejs');
})


app.get('/chemical',(req,res)=>{

  res.render('chemical.ejs');
})

app.get('/radiation',(req,res)=>{

  res.render('radiation.ejs');
})

app.get('/electric',(req,res)=>{

  res.render('electric.ejs');
})
app.get('/features.ejs',(req,res)=>[
    res.render('features')
    ])
app.get('/contact.ejs',(req,res)=>[
        res.render('contact')
    ])        
app.get('/aboutai.ejs',(req,res)=>[
        res.render('aboutai')
    ]) 
app.get('/cl',(req,res)=>{
  res.render('camera.ejs')
})     

app.post('/done',(req,res)=>{

  var data=req.body.FirstName;
  console.log(data);
  res.render('contact.ejs',{ });
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      return cb(null, path.join(__dirname, "uploads"))
    },
    filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`)
    }
  })
  
  const upload = multer({ storage })

  app.post('/stats', upload.single('uploaded_file'), async(req,res,next)=>{
    
    console.log(req.body.newItem);
    
    const filePath = { "fname": req.file.path};
    console.log(filePath);
    let data = new FormData();
    data.append('file', fs.createReadStream((req.file.path)));
    console.log((req.file.path));
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://burns-project.onrender.com/predict/?name=' + req.body.newItem,
      headers: { 
        ...data.getHeaders()
      },
      data : data
    };
  
  axios.request(config)
  .then((response) => {
    console.log((response.data));
    console.log(res.body);
    res.render('prediction.ejs',{ data:response.data});;
  })
  .catch((error) => {
    console.log(error);
  });
 
});

if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
    fs.mkdirSync(path.join(__dirname, 'uploads'));
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});