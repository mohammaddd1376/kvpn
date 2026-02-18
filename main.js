const http = require('http');
const shell = require('shelljs');
const eURL = require('url');
const site_server = http.createServer();
const logger = require('logger').createLogger("vpn.log");
const TronWeb = require('tronweb')
const bcrypt = require('bcrypt');
const fs = require('fs');
const httpPort = 3000;
const version = 2.2;
const resolveConfFile = "/etc/resolv.conf"
const serverConfFile = "/etc/openvpn/server/server.conf"
let Contract = null;
let tronWeb = null;
let smartAddress = "";
const sleep = require('sleep-promise');


startHttpServer();
async function startHttpServer() {

  
    logger.info("http server start ...");

    site_server.on('error', (err)=>{
        logger.error("http server error ", err.stack);
    });

    site_server.on('request', async function (req, res) {
        logger.info("*** start request", req.method);
  res.setHeader('Access-Control-Allow-Origin', '*');
   
        try {

            let U = eURL.parse(req.url, true);
            logger.info("request info", req.method, JSON.stringify(U));

            if (req.method === "GET") {
                switch (U.pathname.replace(/^\/|\/$/g, '')) {
                    case "create" :
                        await addVpn(req, res, U.query);
                        break;
                    case "remove" :
                        await removeVpn(req, res, U.query);
                        break;
                     case "list" :
                        await listUser(req, res, U.query);
                        break;

                    case "check" :
                        await checkToken(req,res,U.query);
                        break;    
                    default :
                        logger.info("pathname not found !", U.pathname);
                }
            }

            logger.info("*** end request");

        }catch (e) {
            logger.error("DANGER !!!! >>> in request ", e.message);
        }

        res.end();
    });

    site_server.listen(httpPort);
    logger.info("http server listen on " + httpPort);
}

async function checkToken(req,res,query){
    try {
        let name = query.publicKey;
        const { stdout, stderr, code } = await shell.exec(`tail -n +2 /etc/openvpn/easy-rsa/pki/index.txt | grep "^V" | cut -d '=' -f 2 | sed -n '/^${name}/p'`, { silent: true });
        if (stdout.trim() !== '') {
            res.write('true')
        } else {
            res.write('false')
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}
async function addVpn(req, res, query){


  let file_is_exist = await  fs.existsSync("/root/"+query.publicKey+".ovpn")
      logger.info('1',file_is_exist)

  if (!file_is_exist) {
      const result =await shell.exec('/home/bvpn/openvpn-install.sh', { async: true });
      result.stdin.write('1\n'); // Enter 1
      result.stdin.write(query.publicKey+'\n'); // Enter name 'ali'
       result.stdin.write('1\n'); // Press Enter
     result.stdin.write('1\n');
     result.stdin.end();
      await sleep(2222)
      let _file = "";
       const filePath = "/root/"+query.publicKey+".ovpn"; // Replace with the actual file path
         let file_is_existss = await  fs.existsSync("/root/"+query.publicKey+".ovpn")
          logger.info('2',file_is_existss)
// Read the file using ShellJS cat command
    const _result =await shell.exec('cat '+filePath+'\n');
    
    logger.info('catttttt',`cat ${filePath}`)
    
    logger.info('catttttt',_result)
// Check if the command executed successfully
if (_result.code === 0) {
  const fileContent = _result.stdout;

  // Print the file content
  console.log(fileContent);
         res.write(fileContent)
 
}else{
    res.write('hello dfdsf')
}  

  } else {
        await sleep(2000)
      let _file = "";
       const filePath = "/root/"+query.publicKey+".ovpn"; // Replace with the actual file path
         let file_is_existss = await  fs.existsSync("/root/"+query.publicKey+".ovpn")
          logger.info('2',file_is_existss)
// Read the file using ShellJS cat command
    const _result =await shell.exec('cat '+filePath+'\n');
    
    logger.info('catttttt',`cat ${filePath}`)
    
    logger.info('catttttt',_result)
// Check if the command executed successfully
if (_result.code === 0) {
  const fileContent = _result.stdout;

  // Print the file content
  console.log(fileContent);
         res.write(fileContent)
 
}
      logger.info('oor is here')
       

  }

           const date = new Date();
    const formattedDate = `${date.getFullYear()}_${(date.getMonth() + 1).toString().padStart(2, '0')}_${date.getDate().toString().padStart(2, '0')}-${date.getHours().toString().padStart(2, '0')}_${date.getMinutes().toString().padStart(2, '0')}_${date.getSeconds().toString().padStart(2, '0')}`;

    const backupFileName = `/root/openvpn_backup_${formattedDate}.tar.gz`;

    await shell.exec(`tar czvf ${backupFileName} /etc/openvpn/ /etc/openvpn/easy-rsa/`);
    logger.info(`Backup created: ${backupFileName}`);

  

    
}




async function removeVpn(req, res, query){




 const result = shell.exec('/home/bvpn/openvpn-install.sh', { async: true });

  
  result.stdin.write('2\n'); // Enter 1
   
  let selecteduser ;
   result.stdout.on('data', (data) => {
 logger.info('Console response:', data.toString());
 
//  const regex = /(\d+)\) ali/;
 const regex = new RegExp(`(\\d+)\\) ${query.publicKey}`);
const matches = regex.exec(data.toString());

if (matches && matches[1]) {
  const numberBeforeAli = parseInt(matches[1]);
  selecteduser =  logger.info('Number before "ali":', numberBeforeAli);
    
  logger.info('selecteduser',parseInt(numberBeforeAli)+'\n')
// result.stdin.write(parseInt(numberBeforeAli)+'\n'); // Enter name 'ali'
  result.stdin.write(numberBeforeAli+'\n'); // Enter name 'ali'
} else {
  logger.info('No match found for the pattern');
}
 
 
 
});
           const date = new Date();
    const formattedDate = `${date.getFullYear()}_${(date.getMonth() + 1).toString().padStart(2, '0')}_${date.getDate().toString().padStart(2, '0')}-${date.getHours().toString().padStart(2, '0')}_${date.getMinutes().toString().padStart(2, '0')}_${date.getSeconds().toString().padStart(2, '0')}`;

    const backupFileName = `/root/openvpn_backup_${formattedDate}.tar.gz`;

    await shell.exec(`tar czvf ${backupFileName} /etc/openvpn/ /etc/openvpn/easy-rsa/`);
    logger.info(`Backup created: ${backupFileName}`);

 
//   result.stdin.write(query.publicKey+'\n'); // Enter name 'ali'
  
logger.on('close', (code) => {
  console.log('Command exited with code:', code);
});
  result.stdin.end();
}






async function listUser(req, res, query){

 //const result = shell.exec('/home/bvpn/openvpn-install.sh', { async: true });
   

const result = shell.exec('tail -n +2 /etc/openvpn/easy-rsa/pki/index.txt | grep "^V" | cut -d "=" -f 2 | nl -s ") "', { async: true });
 let _listuser ;
  
//  result.stdin.write('2\n'); // Enter 1
  result.stdout.on('data',async(data)=>{
_listuser = await data.toString()
} );
  

  result.stdin.end();
 await sleep(2000)
  logger.info('Console response:', _listuser);
  await res.write(_listuser)
}
