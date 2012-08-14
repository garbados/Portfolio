homeHTML = $('#content').html()

pages = []
$.ajax({
		url : "api/v1/pages",
		success : (data) -> 
			pages = eval(data)
			console.log(pages)
	})

$('#home').click(showHome)
$('#stories').click(showStories)
$('#games').click(showGames)

showHome () ->
	showSection(homeHTML)

showStories () ->

showGames () ->

# change sections
showSection (new_section) ->
	if $('#content').html() is not new_section
		transition($('#content'), new_section)

# slide out one section, slide in another
transition (current_section, new_section, duration = 500) ->
	$(current_section).slideUp(duration, () -> $(new_section).slideDown(duration))