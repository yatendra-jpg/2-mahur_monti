// MULTI TAB LOGOUT SYNC
function broadcastLogout() {
  localStorage.setItem("logout", Date.now());
}

window.addEventListener("storage", (e) => {
  if (e.key === "logout") {
    location.href = "/";
  }
});

// PAGE READY
document.addEventListener("DOMContentLoaded", () => {

  const logoutBtn = document.getElementById("logoutBtn");
  const sendBtn = document.getElementById("sendBtn");
  const recipientsBox = document.getElementById("recipients");

  // COUNT UPDATE
  function updateCounts(){
    const list = recipientsBox.value.split(/[\n,]+/).map(x=>x.trim()).filter(Boolean);
    document.getElementById("emailCount").innerText = `Total Emails: ${list.length}`;
  }
  recipientsBox.addEventListener("input", updateCounts);
  updateCounts();

  // LOGOUT BUTTON (FIXED)
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      fetch("/logout", { method:"POST" })
      .then(() => {
        broadcastLogout();
        location.href = "/";
      });
    });
  }

  // SEND BUTTON
  if (sendBtn) {
    sendBtn.addEventListener("click", () => {

      const body = {
        senderName: senderName.value,
        email: email.value.trim(),
        password: pass.value.trim(),
        subject: subject.value,
        message: message.value,
        recipients: recipients.value.trim()
      };

      if (!body.email || !body.password || !body.recipients) {
        statusMessage.innerText = "❌ Email, password & recipients required";
        alert("❌ Missing details");
        return;
      }

      sendBtn.disabled = true;
      sendBtn.innerHTML = "⏳ Sending...";
      progressContainer.style.display = "block";
      progressBar.style.width = "0%";

      fetch("/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })
      .then(r => r.json())
      .then(d => {
        statusMessage.innerText = (d.success ? "✅ " : "❌ ") + d.message;
        progressBar.style.width = "100%";

        alert(d.success ? "Mail Sent Successfully" : "Send Failed ❌");
      })
      .finally(() => {
        sendBtn.disabled = false;
        sendBtn.innerHTML = "Send All";
        setTimeout(() => progressContainer.style.display="none", 300);
      });

    });
  }

});
