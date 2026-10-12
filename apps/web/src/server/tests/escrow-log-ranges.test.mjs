import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createChain } from '../chain.ts';

test('escrow adapter respects Monad 100-block limit and rejects an incomplete history', async t => {
  const requests=[]; let fail=false;
  const server=createServer(async(req,res)=>{
    let raw=''; for await(const chunk of req) raw+=chunk;
    const q=JSON.parse(raw); let result='0x279f'; let error;
    if(q.method==='eth_getLogs') {
      const p=q.params[0], from=BigInt(p.fromBlock), to=BigInt(p.toBlock);
      requests.push([from,to]);
      if(to-from>=100n || (fail && from===200n)) error={code:-32602,message:'log range rejected'};
      result=[];
    }
    res.setHeader('Content-Type','application/json');
    res.end(JSON.stringify({jsonrpc:'2.0',id:q.id,...(error?{error}:{result})}));
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  t.after(()=>new Promise(resolve=>server.close(resolve)));
  const chain=createChain({chainId:10143,mode:'testnet',rpcUrl:`http://127.0.0.1:${server.address().port}`,confirmations:1});
  const address='0x'+'12'.repeat(20);
  assert.deepEqual(await chain.events(address,'0','1005'),[]);
  assert.equal(requests.length,11);
  assert.deepEqual(requests[0],[0n,99n]);
  assert.deepEqual(requests[10],[1000n,1005n]);
  requests.length=0; fail=true;
  await assert.rejects(chain.events(address,'0','999'));
  assert.ok(requests.every(([from])=>from<=200n));
});
