// Kiểm tra chuyển trạng thái bằng Node; DOM được giả lập, không thay thế test trình duyệt.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const source=html.match(/<script>([\s\S]*?)<\/script>/)[1];
new Function(source);
const start=source.indexOf('function send(c, text)');
const end=source.indexOf('$("#composer")',start);
let body=source.slice(source.indexOf('"use strict";'),source.indexOf('/* ---------- events ---------- */'))+source.slice(start,end);
const output=[];
const dummy=()=>({innerHTML:'',textContent:'',dataset:{},classList:{add(){},toggle(){}},querySelectorAll(){return []},querySelector(){return dummy()},appendChild(){}});
const doc={querySelector(){return dummy()},createElement(){return dummy()}};
body+=`\nconst captured=[];
renderQueue=()=>{}; renderDetail=()=>{}; renderTools=()=>{};
select=c=>{selected=c;}; refresh=()=>{};
userMsg=(c,t)=>captured.push(['user',c,t]);
aiMsg=(c,t)=>{captured.push(['ai',c,t]);return {classList:{add(){}}};};
add=(c,e)=>e; el=h=>({html:h,dataset:{},querySelector:()=>({innerHTML:''})});
renderKV=(card,summary)=>{card._summary=summary;};
toast=t=>captured.push(['toast',t]);
globalThis.api={session,cases,SEEDS,captured,send,correction,productCard,createCase,consent,undoHandoff,sendPhoto,tool,detect,tick};`;
function fresh(){const ctx={document:doc,console,setTimeout,clearTimeout,Date,window:{prompt:()=> 'Khách sửa: bé vẫn tỉnh'},URLSearchParams};vm.createContext(ctx);vm.runInContext(body,ctx);return ctx.api;}
function test(name,fn){fn();output.push('PASS '+name);}
test('K1: cảnh báo và chuyển khẩn, khóa sản phẩm',()=>{const a=fresh();a.send('k1',a.SEEDS.k1);assert.equal(a.cases.k1.lane,'red');assert.equal(a.session.k1.tools.khuyen_di_kham.status,'Đã chạy');assert.equal(a.session.k1.tools.goi_y_san_pham.status,'Bị chặn');assert.match(a.captured.find(r=>r[0]==='ai')[2],/khám NGAY/);});
test('K1: tin mới không hạ ca khẩn hoặc mở gợi ý',()=>{const a=fresh();a.send('k1',a.SEEDS.k1);a.send('k1',a.SEEDS.k4);a.productCard('k1',{by:'ai'});assert.equal(a.cases.k1.lane,'red');assert.equal(a.session.k1.tools.goi_y_san_pham.status,'Bị chặn');});
test('K1: sửa thông tin vẫn giữ cờ đỏ',()=>{const a=fresh();a.send('k1',a.SEEDS.k1);a.correction('k1');assert.equal(a.session.k1.red,true);assert.match(a.cases.k1.summary['Khách sửa'],/vẫn tỉnh/);});
test('K2: chuyển thường, không soạn nháp',()=>{const a=fresh();a.send('k2',a.SEEDS.k2);assert.equal(a.cases.k2.lane,'normal');assert.equal(a.cases.k2.draftState,'none');assert.equal(a.session.k2.saved,null);});
test('K2: tin mới không ghi đè người dùng thuốc cũ',()=>{const a=fresh();a.send('k2',a.SEEDS.k2);a.send('k2','con 5 tuổi');assert.match(a.cases.k2.summary['Người dùng thuốc'],/78/);assert.equal(a.session.k2.risk,true);});
test('K2: hủy chuyển thường vẫn khóa gợi ý',()=>{const a=fresh();a.send('k2',a.SEEDS.k2);a.undoHandoff('k2');assert.equal(a.cases.k2,undefined);assert.equal(a.session.k2.risk,true);assert.match(a.session.k2.summary['Người dùng thuốc'],/78/);});
test('K1: không hủy ca khẩn bằng hàm hủy thường',()=>{const a=fresh();a.send('k1',a.SEEDS.k1);a.undoHandoff('k1');assert.equal(a.cases.k1.lane,'red');});
function consentButton(c,text){const card={dataset:{note:text},querySelector:()=>({innerHTML:''})};return {closest:q=>q==='.card'?card:{dataset:{case:c}}};}
test('Ghi chú: chỉ lưu sau đồng ý và đúng nội dung đã xem',()=>{const a=fresh();a.send('k2',a.SEEDS.k2);assert.equal(a.session.k2.saved,null);a.consent(consentButton('k2','Nội dung giả đã xem'),true);assert.equal(a.session.k2.saved,'Nội dung giả đã xem');assert.equal(a.session.k2.tools.luu_ghi_chu_suc_khoe.status,'Đã chạy');});
test('Ghi chú: từ chối không lưu',()=>{const a=fresh();a.send('k2',a.SEEDS.k2);a.consent(consentButton('k2','Nội dung giả'),false);assert.equal(a.session.k2.saved,null);assert.equal(a.session.k2.tools.luu_ghi_chu_suc_khoe.status,'Không thực hiện');});
test('Thuốc kê đơn: không được gửi gợi ý thay thế',()=>{const a=fresh();a.send('k4','mua kháng sinh');a.productCard('k4',{by:'ds'});assert.equal(a.session.k4.tools.ban_thuoc_ke_don.status,'Bị chặn');assert.equal(a.session.k4.tools.goi_y_san_pham.status,'Bị chặn');});
test('Tin ngoài fixture K4 chuyển người, không tự gợi ý',()=>{const a=fresh();a.send('k4','còn hàng ở chi nhánh nào');assert.equal(a.cases.k4.lane,'normal');assert.equal(a.session.k4.tools.goi_y_san_pham.status,'Bị chặn');});
test('K2 bổ sung dấu hiệu đỏ: lên làn khẩn và giữ thông tin trước',()=>{const a=fresh();a.send('k2',a.SEEDS.k2);a.send('k2','giờ khó thở');assert.equal(a.cases.k2.lane,'red');assert.match(a.cases.k2.summary['Tin gốc'],/78/);});
console.log('Kiểm tra cú pháp JavaScript: PASS\n'+output.join('\n')+'\n'+output.length+' kiểm tra trạng thái PASS. DOM được giả lập; chưa kiểm tra bố cục hoặc click thật.');
