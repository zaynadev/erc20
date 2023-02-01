const tokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const dexAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const tokenAbi = [
  "constructor(uint256 supply)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function decreaseAllowance(address spender, uint256 subtractedValue) returns (bool)",
  "function increaseAllowance(address spender, uint256 addedValue) returns (bool)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
];
const dexAbi = [
  "constructor(address _token, uint256 _price)",
  "function buy(uint256 tokens) payable",
  "function getPrice(uint256 tokens) view returns (uint256)",
  "function getTokenBalance() view returns (uint256)",
  "function sell()",
  "function token() view returns (address)",
  "function withdrawFunds()",
  "function withdrawTokens()",
];

const provider = new ethers.providers.Web3Provider(window.ethereum);
let tokenContract, dexContract, signer;

async function getAccess() {
  if (tokenContract && dexContract) return;
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
  dexContract = new ethers.Contract(dexAddress, dexAbi, signer);
}

async function grantAccess() {
  await getAccess();
  const amount = document.getElementById("tokenGrant").value;
  await tokenContract.approve(dexAddress, amount);
}

async function sell() {
  await getAccess();
  await dexContract.sell();
}

async function buyTokens() {
  await getAccess();
  const amount = document.getElementById("tokensToBuy").value;
  const price = await dexContract.getPrice(1);
  await dexContract.buy(amount, { value: amount * price });
}

async function getTokenBalance() {
  await getAccess();
  const balance = await tokenContract.balanceOf(signer.getAddress());
  document.getElementById("tokenBalances").innerHTML = balance;
}

async function getAvailableTokens() {
  await getAccess();
  const balance = await dexContract.getTokenBalance();
  document.getElementById("tokensAvailable").innerHTML = balance;
}

async function getPrice() {
  await getAccess();
  const price = await dexContract.getPrice(1);
  document.getElementById("tokenPrice").innerHTML = price;
}
