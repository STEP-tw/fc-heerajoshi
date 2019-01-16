const hideJar = function(){
  let jar = document.getElementById("jar");
  jar.style.visibility = "hidden";
  setTimeout(() => {
    jar.style.visibility = "visible";
  }, 1000);
}

window.onload = function(){
  const jar = document.getElementById("jar");
  jar.onclick = hideJar;
}
