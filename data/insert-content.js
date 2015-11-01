self.port.on("message-to-tab", function(content) {
	/*console.log("facebook "+content);	
	$("#entity_field_firstname").val(content);
	/*for(i=0; i<content.length; i++) {
		console.log(i);
	}*/
	var json_text=JSON.parse(content);
	jQuery.each(json_text, function(i, val) {
		if(i=="wym_iframe")
			$("iframe.form-control").contents().find('html').html(val);
		else if (i=="[id^=uploader]")
			$(i).val(val);
		else	
			$("#"+i).val(val);
	});
});
