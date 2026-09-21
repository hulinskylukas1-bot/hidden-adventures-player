const SUPABASE_URL='https://hnhyscllpnyzbxhrffph.supabase.co';
const SUPABASE_KEY='sb_publishable_w0N986iN3rTUBQjDLogNhQ_BXcmNRWH';
let orderId=null;
const $=id=>document.getElementById(id);
async function callFunction(name,body){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),15000);
  try{
    const res=await fetch(`${SUPABASE_URL}/functions/v1/${name}`,{
      method:'POST',
      headers:{'apikey':SUPABASE_KEY,'Authorization':`Bearer ${SUPABASE_KEY}`,'Content-Type':'application/json'},
      body:JSON.stringify(body),signal:controller.signal
    });
    const txt=await res.text();let data={};try{data=txt?JSON.parse(txt):{}}catch{data={message:txt}}
    if(!res.ok||data?.error)throw new Error(data?.error||data?.message||`HTTP ${res.status}`);
    return data;
  }finally{clearTimeout(timer)}
}
$('orderForm').addEventListener('submit',async e=>{
  e.preventDefault(); const btn=e.submitter; $('error').textContent='';
  btn.disabled=true;btn.textContent='Vytvářím objednávku…';
  try{
    const data=await callFunction('create-test-order',{email:$('email').value,customer_name:$('name').value});
    orderId=data.order_id;
    $('orderForm').classList.add('hidden');$('payment').classList.remove('hidden');
  }catch(err){
    $('error').textContent=String(err.message).includes('INVALID_EMAIL')?'Zadejte platný e-mail.':'Objednávku se nepodařilo vytvořit. Zkuste to znovu.';
  }finally{btn.disabled=false;btn.textContent='Pokračovat k testovací platbě'}
});
$('back').onclick=()=>{$('payment').classList.add('hidden');$('orderForm').classList.remove('hidden');orderId=null};
$('simulatePayment').onclick=async()=>{
  const btn=$('simulatePayment');btn.disabled=true;btn.textContent='Potvrzuji testovací platbu…';
  try{
    const data=await callFunction('complete-test-order',{order_id:orderId});
    $('licenseCode').textContent=data.license_code;
    $('payment').classList.add('hidden');$('success').classList.remove('hidden');
  }catch(err){
    btn.disabled=false;btn.textContent='Simulovat úspěšnou platbu';
    alert('Testovací platbu se nepodařilo dokončit.');
  }
};
$('copyCode').onclick=async()=>{
  const code=$('licenseCode').textContent.trim();
  try{await navigator.clipboard.writeText(code);$('copyCode').textContent='Kód zkopírován'}catch{$('copyCode').textContent=code}
};