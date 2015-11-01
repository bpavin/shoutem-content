// When the user hits return, send the "text-entered"
// message to main.js.
// The message payload is the contents of the edit box.
var textArea = document.getElementById("edit-box");
/*textArea.addEventListener('keyup', function onkeyup(event) {
  if (event.keyCode == 13) {
    // Remove the newline.
    text = textArea.value.replace(/(\r\n|\n|\r)/gm,"");
    self.port.emit("text-entered", text);
    textArea.value = '';
  }
}, false);*/
// Listen for the "show" event being sent from the
// main add-on code. It means that the panel's about
// to be shown.
//
// Set the focus to the text area so the user can
// just start typing.
self.port.on("show", function onShow() {
  textArea.focus();
});
var selected;
var hideAllOptions = function() {
    $("[id$=options]").each(function() {
     	$(this).hide();   
    });
	selected = $("select").find(":selected").attr("value");
    $("#"+selected+"-options").show();
}
hideAllOptions();
$("select").change(function() {
    hideAllOptions();
    
});

// Enter button click, send data to website
/*$('#enter').on("click", function() {
	//textArea.value = $('select option:selected').text();
	var arText = textArea.value.split("\t");
    	var j = JSON.parse('{"n":"klos"}');
	self.port.emit("message-to-tabs", arText);
	for(var i=0; i<arText.length; i++) {
		console.log(arText[i]);
	}
});*/

$("#enter").on("click", function() {
    //alert($("textarea").val());
    var arText = $("textarea").val().split("\t");
	//alert(arText[0]);
    
    var arIds=[];
    $("#"+selected+"-options input").each(function() {
        if(this.checked){
        //alert($(this).attr("value"));
        //alert($("input:checked").attr("value"));
        	arIds.push($(this).attr("value"));
        }
        
    });
    var text="{";
    for(var i=0; i<arIds.length; i++){
   		text+="\""+arIds[i]+"\" : \""+arText[i]+"\"";
        if(i!=arIds.length-1) text+=",";
	}
    text+="}";
    /*var json_text=JSON.parse(text);
    var ispis="";
    jQuery.each(json_text, function(i, val) {
      //$("#" + i).append(document.createTextNode(" - " + val));
        ispis+=i+" "+val;
    });*/
    $("textarea").val(text); 
    self.port.emit("message-to-tabs", text);
});


