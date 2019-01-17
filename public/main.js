const hideJar = function(){
  let jar = document.getElementById("jar");
  jar.style.visibility = "hidden";
  setTimeout(() => {
    jar.style.visibility = "visible";
  }, 1000);
}
const initialise = function(){
  const jar = document.getElementById("jar");
  jar.onclick = hideJar;
}

window.onload = initialise;
