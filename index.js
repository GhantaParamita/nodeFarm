const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");
const replaceTemplate = require("./modules/replaceTemplate");
//////////////////////////////////////////////
//FILES
//Blockig, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt','utf-8');
// console.log(textIn);
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written!');

//Non-blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1)=>{
//     if(err) return console.log('Error!');
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2)=>{
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3)=>{
//             console.log(data3);
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err =>{
//                 console.log('File has been written');
//             });
//         });
//     });
// });
// console.log('will read file!');

//////////////////////////////////////////////
//SERVER

const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);
// console.log(slugify('Fresh Avocados', {lower: true}));

const server = http.createServer((req, res) => {
  // console.log(req.url);
  const { query, pathname } = url.parse(req.url, true);
  // const pathName = req.url;

  //Overview page

  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "content-type": "text/html" });

    const cardHtml = dataObj
      .map((el) => replaceTemplate(templateCard, el))
      .join("");
    const output = templateOverview.replace("{%PRODUCT_CARDS%}", cardHtml);

    // console.log(cardHtml);

    res.end(output);

    //Product Page
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(templateProduct, product);
    // res.end('This is the PRODUCT');

    res.end(output);

    //API
  } else if (pathname === "/api") {
    // fs.readFile(`${__dirname}/dev-data/data.json`,'utf-8',(err,data)=>{
    //     const productData = JSON.parse(data);
    // console.log(productData);
    res.writeHead(200, { "content-type": "application/json" });
    res.end(data);
    // })

    //Not Found
  } else {
    res.writeHead(404, {
      "content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

// server.listen(8000, '127.0.0.1', () => {
//   console.log('Listening to request on post 8000');
// });

const port = process.env.PORT || 8000;

server.listen(port, "0.0.0.0", () => {
  console.log(`Listening to request on port ${port}`);
});
