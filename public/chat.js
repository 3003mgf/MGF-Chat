((io, $)=>{
let IO = io();
let username = "";
const COLORS = [
  '#e21400', '#91580f', '#f8a700', '#f78b00',
  '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
  '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
];

//Enfocamos el input del nickname
$(".nickname-input").focus();

//Elegimos el nickname
$(".nickname-form").on("submit", (e)=>{
  e.preventDefault();

//Validamos si el usuario ya existe.
  let tmpUsername = e.target.nicknameInput.value.trim();
  IO.emit("checkUsername", cleanInput(tmpUsername), (cb)=>{
   if(cb){
     username = tmpUsername;
     IO.emit("setUserName", username);
     $(".nickname-article").fadeOut();
     $("#message").focus();

   }else{

     $("#wrong-nickname").html(`The username <b>${tmpUsername}</b> is already used`).css("color", "linen");
     $(".nickname-input").val("");
   }
  });

})

//Mandamos mensajes
$(".message-form").on("submit", (e)=>{
e.preventDefault();
IO.emit("new message", {message: e.target.message.value});
e.target.message.value = "";
})




const setUserName = () =>{
  
}

const getUsernameColor = (username) => {
  // Compute hash code
  let hash = 7;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + (hash << 5) - hash;
  }
  // Calculate color
  const index = Math.abs(hash % COLORS.length);
  return COLORS[index];
};

const cleanInput = (message) => {
  return $('<div/>').text(message).html();
};


IO
  .on("welcome",(data)=>{
    document.querySelector(".welcomeMsg").innerHTML = `<p class="welcomeMsg">${data.message}</p>`;
  })

  .on("show message", (data)=>{
    $(".messages").append(`<li><b style="color:${getUsernameColor(data.username)}">${data.username}:</b>  ${cleanInput(data.message)}</li>`);
  })
  
  .on("new user", (data)=>{
    $(".messages").append(`<p class="joinMsg" style="background-color: ${getUsernameColor(data.username)}">${data.message}</p>`)
  })

  .on("user left", (data)=>{
    $(".messages").append(`<p class="leftMsg" style="color:${getUsernameColor(data.username)}">${data.message}</p>`)
  })
 

})(io, jQuery)