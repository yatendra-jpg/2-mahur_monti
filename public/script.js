let count = 0;

function update(){
    document.getElementById("count").innerText = count;
}

function popup(msg, type){
    const p = document.getElementById("popup");
    p.innerHTML = msg;
    p.style.background = type === "error" ? "#ff3b3b" : "#28c746";
    p.style.top = "20px";
    setTimeout(()=> p.style.top = "-80px",3000);
}

async function sendMail(){
    sendBtn.disabled = true;
    sendBtn.innerHTML = "Sending...";

    let payload = {
        fromName: fromName.value,
        gmail: gmail.value,
        appPass: appPass.value,
        subject: subject.value,
        body: body.value,
        to: to.value
    };

    let res = await fetch("/send",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload)
    });

    let data = await res.json();

    if(data.success){
        count++;
        update();
        popup("Mail Sent ✅","success");
    } else {
        popup("Wrong Gmail / App Password ☒","error");
    }

    sendBtn.disabled = false;
    sendBtn.innerHTML = "Send";
}

function logout(){
    count = 0;
    update();
}
