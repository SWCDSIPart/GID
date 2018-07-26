# GID

### Set IP of web server
Set ip address in gid_rest/public/js/service.js:8
>  var localIP = '192.168.0.191'; 

### How to run

#### Starting Blockchain and REST API
> $ ./startGID.sh

#### Starting Blockchain only (optional)
> $ cd gid_blockchain/gid/  
> $ ./startFabric.sh  

#### Starting REST API only (optional)
> $ cd ../gid_rest/  
> $ ./start.sh  

note: 첫 실행 시 npm install을 해야 함.
 
