suite('Global Tests',()=>{
	test('page have a valid title:'+document.title,()=>{
		assert(document.title && document.title.toUpperCase() !== 'TODO')
	})

})