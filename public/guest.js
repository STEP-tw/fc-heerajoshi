const updateCommentBox = function(content){
  const commentBox = document.getElementById("comments");
  commentBox.innerHTML = content;
};

const updateComment = function(){
  fetch('/comments')
  .then(response => response.text())
  .then(updateCommentBox)
}

const initialise = function(){
  const reloadButton = document.getElementById("reload");
  reloadButton.onclick = updateComment;
}


window.onload = initialise;