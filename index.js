import axios from "axios";
import  express from "express";
import request from "request";
import fs from "fs";
import FormData from "form-data";
import multer from "multer"
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));


const app=express();
const port=3000;

app.get('/',(req,res)=>{
    res.render('index.ejs');
})

let data = new FormData();

// app.use(bodyParser.urlencoded({extended:true}));
// app.use(bodyParser.json());
app.use(express.json());

app.set('view engine', 'ejs');
// app.set("views", path.resolve("/views"));

app.use('/public', express.static('public'));




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
    
let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'http://13.48.136.54:8000/api/api-code/',
          headers: { 
            'Authorization': 'Bearer e4a19872-caf9-448f-ad3d-17f26e5d32dd', 
            ...data.getHeaders()
          },
          data : data
    };


    axios.post('http://13.48.136.54:8000/api/api-code/',data,config)
.then((response) => {
        console.log(JSON.stringify(response.data));
        code=JSON.stringify(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
    console.log(code);



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      return cb(null, "D:/start/uploads")
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
      url: `http://127.0.0.1:8000/predict/?name=${req.body.newItem}`,
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
app.listen(port,()=>{
    console.log(`server is running at ${port} `)
})