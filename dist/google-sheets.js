(()=>{(()=>{let r=o=>String(o||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"),g=()=>{let o=document.body.getAttribute("data-url");if(!o||!o.includes("script.google.com"))return;let s=document.getElementById("comments"),i=document.getElementById("form-name"),f=document.getElementById("form-presence"),l=document.getElementById("form-comment"),d=document.getElementById("button-send-comment")||document.querySelector("#comment button.btn-primary")||document.querySelector('#comment button[onclick*="comment.send"]');if(i){let e=new URLSearchParams(window.location.search).get("to");if(e)i.value=decodeURIComponent(e);else try{let a=localStorage.getItem("guest_name");a&&(i.value=a)}catch{}}let u=t=>{if(s){if(!t||t.length===0){s.innerHTML=`
                    <div class="text-center p-4 mx-0 mt-0 mb-3 bg-theme-auto rounded-4 shadow">
                        <p class="fw-bold p-0 m-0" style="font-size: 0.95rem;">
                            \u{1F4E2} Belum ada ucapan. Jadilah yang pertama memberikan ucapan & doa! \u{1F389}
                        </p>
                    </div>`;return}s.innerHTML=t.map(e=>{let c=e.presence===!0||e.presence==="Hadir"||e.presence=="1"?'<i class="fa-solid fa-circle-check text-success ms-1" title="Hadir"></i>':'<i class="fa-solid fa-circle-xmark text-danger ms-1" title="Berhalangan"></i>',m="";if(e.date){let n=new Date(e.date);!isNaN(n.getTime())&&String(e.date).includes("-")?m=n.toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"})+", "+n.toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"}):m=r(String(e.date))}return`
                <div class="bg-theme-auto shadow p-3 mx-0 mt-0 mb-3 rounded-4">
                    <div class="d-flex justify-content-between align-items-center">
                        <p class="text-theme-auto text-truncate m-0 p-0" style="font-size: 0.95rem;">
                            <strong class="me-1">${r(e.name||"Tamu")}</strong> ${c}
                        </p>
                        <small class="text-theme-auto m-0 p-0" style="font-size: 0.75rem;">${m}</small>
                    </div>
                    <hr class="my-1">
                    <p class="text-theme-auto my-1 mx-0 p-0" style="white-space: pre-line;">${r(e.comment||"")}</p>
                </div>`}).join("")}},h=async()=>{if(s){s.innerHTML=`
                <div class="text-center p-3 text-secondary">
                    <span class="spinner-border spinner-border-sm me-2"></span>Memuat ucapan...
                </div>`;try{let e=await(await fetch(o,{method:"GET",redirect:"follow"})).text();console.log("Google Sheets response:",e);let a;try{a=JSON.parse(e)}catch{console.error("Response bukan JSON valid:",e.substring(0,500)),u([]);return}a&&a.status==="success"&&Array.isArray(a.data)?u(a.data):(console.warn("Format response tidak sesuai:",a),u([]))}catch(t){console.error("Gagal memuat ucapan dari Google Sheets:",t),s.innerHTML=`
                    <div class="text-center p-4 mx-0 mt-0 mb-3 bg-theme-auto rounded-4 shadow">
                        <p class="fw-bold p-0 m-0 text-danger" style="font-size: 0.95rem;">
                            \u26A0\uFE0F Gagal memuat ucapan. Silakan refresh halaman.
                        </p>
                        <small class="text-muted">${r(t.message)}</small>
                    </div>`}}},b=async t=>{let e=i?.value?.trim()||"",a=f?.value||"0",c=l?.value?.trim()||"";if(!e){alert("Silakan isikan Nama Anda."),i?.focus();return}if(a==="0"){alert("Silakan pilih Konfirmasi Presensi (Datang / Berhalangan)."),f?.focus();return}if(!c){alert("Silakan tuliskan Ucapan & Doa Anda."),l?.focus();return}let m=t.innerHTML;t.disabled=!0,t.innerHTML='<span class="spinner-border spinner-border-sm me-2"></span>Mengirim...';try{let n=new FormData;n.append("name",e),n.append("presence",a==="1"?"1":"0"),n.append("comment",c),await fetch(o,{method:"POST",mode:"no-cors",body:n});try{localStorage.setItem("guest_name",e)}catch{}let y=new Date,v=y.toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"})+", "+y.toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"}),S=a==="1"?'<i class="fa-solid fa-circle-check text-success ms-1" title="Hadir"></i>':'<i class="fa-solid fa-circle-xmark text-danger ms-1" title="Berhalangan"></i>',x=s?.querySelector(".text-center");x&&x.remove();let p=document.createElement("div");p.className="bg-theme-auto shadow p-3 mx-0 mt-0 mb-3 rounded-4",p.innerHTML=`
                    <div class="d-flex justify-content-between align-items-center">
                        <p class="text-theme-auto text-truncate m-0 p-0" style="font-size: 0.95rem;">
                            <strong class="me-1">${r(e)}</strong> ${S}
                        </p>
                        <small class="text-theme-auto m-0 p-0" style="font-size: 0.75rem;">${r(v)}</small>
                    </div>
                    <hr class="my-1">
                    <p class="text-theme-auto my-1 mx-0 p-0" style="white-space: pre-line;">${r(c)}</p>
                `,s&&s.prepend(p),l&&(l.value=""),alert("Terima kasih atas ucapan dan doa restunya!"),setTimeout(()=>{h()},2500)}catch(n){console.error("Error sending comment:",n),alert("Gagal mengirim ucapan. Silakan coba lagi.")}finally{t.disabled=!1,t.innerHTML=m}};d&&(d.removeAttribute("onclick"),d.onclick=t=>{t.preventDefault(),t.stopPropagation(),b(d)}),h()};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",g):g()})();})();
