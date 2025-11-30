let count = 0;

function update(){
    document.getElementById("count").innerText = count;
}

function popup(msg, type){
    let p = document.getElementById("popup");
    p.innerHTML = msg;
    p.style.background = type === "error" ? "#ff3b3b" : "#28c746";
    p.style.top = "20px";
    setTimeout(()=> p.style.top = "-80px", 3000);
}

async function sendMail(){
    sendBtn.disabled = true;
    sendBtn.innerHTML = "Sending...";

    let recList = to.value.split(/[\n,]+/).map(x => x.trim()).filter(x => x);

    for (let emailTo of recList){

        let res = await fetch("/send", {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                fromName: fromName.value,
                gmail: gmail.value,
                appPass: appPass.value,
                subject: subject.value,
                body: body.value,
                to: emailTo
            })
        });

        let data = await res.json();

        if(data.success){
            count++;
            update();
        } else {
            popup("❌ Wrong Gmail/App Password","error");
            break;
        }
    }

    sendBtn.disabled = false;
    sendBtn.innerHTML = "Send All";
    popup("Mail Sent ✅","success");
}

function logout(){
    count = 0;
    update();
}
