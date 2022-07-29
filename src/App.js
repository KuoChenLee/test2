import logo from './logo.svg';
import './App.css';
import { Button,Container,Row,Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import React, {useState,useEffect} from 'react';

const web3Modal = new Web3Modal({
  network: "Rinkeby", // testnet
  
  providerOptions:{} 
});
const contractAddr='0xB4E906e646E41672A5Fd9Fa36e29332eB2FCc2a2'
const abi=[
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_greeting",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "greet",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_greeting",
        "type": "string"
      }
    ],
    "name": "setGreeting",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

function App() {
  const [address,setAddress]=useState('');
  const [balance,setBalance]=useState('');
  const [userinput,setUserinput]=useState('');
  const [ens,setEns]=useState('');
  const [msg,setMsg]=useState('');
  const [contract,setContract]=useState('');
  const shortenAddr=addr=>addr.slice(0,4)+"..."+addr.slice(-4)

    async function init(){
      const instance = await web3Modal.connect();

      const provider = new ethers.providers.Web3Provider(instance);//初始化web3Provider
      const signer = provider.getSigner();//getSigner拿到簽章
      const addr=await signer.getAddress();


      setEns(await provider.lookupAddress(addr))
      console.log(addr)
      setAddress(addr)

      const _contract=new ethers.Contract(contractAddr,abi,signer)
      setContract(_contract)
      window.contract=_contract

      const bal=await provider.getBalance(addr);
      setBalance(ethers.utils.formatEther(bal))

      
    }
    async function getMessage(){
      
      console.log(contract)
      //window.contract=contract
      const _msg=await contract.greet();
      console.log(_msg)
      setMsg(_msg)
    }

    async function setMessage(msg){
      
      
      await contract.setGreeting(msg);

      //await getMessage()
    }
    


  return (
    <div className="App">
      <Container className='mt-5'>
        <Row>
          <Col>
          <h2>hello {shortenAddr(address)}{ens},you have {balance} Ethers</h2>
          </Col>
        </Row>
        <Row className='mt-5'>
          <Col>
            <h3>Greet:{msg}</h3> 
          </Col>
        </Row>
        {address &&<Row className='mt-5'>
          <Col>
            <h3>currunt user input:{userinput}</h3>
            <input type="text" value={userinput} onChange={e=>setUserinput(e.target.value)}/>
            <Button onClick={()=>{setMessage(userinput);userinput=""}}>Set Message </Button>   
          </Col>
        </Row>}
        {address &&<Row className='mt-5'>
          <Col>
            <Button onClick={()=>{getMessage()}}>GetMessage </Button>    
          </Col>
        </Row>}
        <Row className='mt-5'>
          <Col>
            <Button onClick={()=>{init()}}>Connect Wallet </Button>    
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
