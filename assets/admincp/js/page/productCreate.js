	$( document ).ready(function() {
		init()
	});

	let product_lot = null;
	let selectedAttr = [];
	let crossArray = [];
	let products = [];

	function init() {
		product_lot = document.getElementById('product-lot').value;
	}

	// product lot change
	$('#product-lot').change(function(e) {
		product_lot = e.target.value;
	})

	// click generate product arrt button
	$('#generate-attr').click(function(e) {
		clearGenerateForm()
		selectedAttr = [];
		let cboxes = document.getElementsByName('attrs[]');
		let len = cboxes.length;
		let attrDetailHtml = ''
		for (let i = 0; i < len; i++) {
			if (cboxes[i].checked) {
			selectedAttr.push({
				id: cboxes[i].value,
				text: cboxes[i].getAttribute('data-text'),
				value: [],
			})
			}
		}
		if (selectedAttr.length > 0) {
			// attr-detail
			attrDetailHtml += '<div class="row">'
			for (let i = 0; i < selectedAttr.length; i++) {
			attrDetailHtml += renderAttrForm(selectedAttr[i], i)
			}
			attrDetailHtml += '</div>'
			attrDetailHtml += '<div class="mt-3">'
			+ '<button id="button-generate-form" class="btn btn-outline-secondary">Generate</button>'
			+ '</div>'
			$('#attr-detail').html(attrDetailHtml)
		}
	});

	// generate form create attr detail
	function renderAttrForm(attr, index) {
		return (
			'<div class="col">'
			+ '<p>' + attr.text + '</p>'
			+ '<div id="attr-' + attr.id + '"></div>'
			+ '<div class="input-group">'
				+ '<input type="text" class="form-control add-attr" placeholder="" aria-label="" aria-describedby="" name="add-attr-' + attr.id + '" id="' + attr.id + '">'
				+ '<div class="input-group-append">'
				+ '<button class="btn btn-outline-secondary button-add-attr" type="button" data-id="' + index + '">+</button>'
				+ '</div>'
			+ '</div>'
			// + '<input type="text" class="form-control add-attr" name="add-attr-' + attr.id + '" id="' + attr.id + '">'
			+ '</div>'
		)
	}

	$(document).on('click', '.button-add-attr', function(e) {
		let dataId = this.getAttribute('data-id')
		let parents = $(this).parents()
		let group = parents.find('.input-group')
		let input = group.children('.add-attr')[dataId]
		let id = input.id
		let name = input.name
		let value = input.value
		if (value) {
			input.value = ""
			renderAttrDetail(id, name, value)
		}
	})

	$(document).on('keypress', '.add-attr', function(e) {
		if(e.which == 13) {
			clearGenerateForm()
			let id = this.getAttribute('id')
			let name = this.getAttribute('name')
			let value = this.value
			if (value) {
			this.value = ''
			renderAttrDetail(id, name, value)
			}
		}
	})

	function renderAttrDetail(id, name, value) {
		for (let i = 0; i < selectedAttr.length; i++) {
			if (selectedAttr[i].id == id) {
			selectedAttr[i].value.push(value)
			}
		}
		$('#attr-' + id).append(
			'<div>'
			+ '<p style="display: inline-block">' + value + '</p>'
			+ '<button type="button" class="close button-remove-attr" data-value="' + id + '-' +value + '"><span aria-hidden="true">&times;</span></button>'
			+ '</div>'
		)
	}

	$(document).on('click', '.button-remove-attr', function(e) {
		clearGenerateForm()
		let delId = this.getAttribute('data-value');
		delId = delId.split('-')
		for (let i = 0; i < selectedAttr.length; i++) {
			for (let j = 0; j < selectedAttr[i].value.length; j++) {
			if (selectedAttr[i].id == delId[0] && selectedAttr[i].value[j] == delId[1]) {
				selectedAttr[i].value.splice(j, 1); 
			}
			}
		}
		$(this).closest('div').remove();
	})

	$(document).on('click', '#button-generate-form', function(e) {
		clearGenerateForm()
		// cross join product attr
		let ar = []
		for (let i = 0; i < selectedAttr.length; i++) {
			ar.push({
				'id': selectedAttr[i].id,
				'value': selectedAttr[i].value
			})
		}
		console.log(selectedAttr, ar);

		let ds = [];
		ar.map(function (e) {
			ds.push(e.value.map(function (val) {
				return JSON.stringify({'id': e.id, 'value': val})
			}))
		})
		console.log(ds, '===');
		let a = ar.map(function (e) {
			return e.value
		})
		console.log(a, '---');
		crossArray = crossJoinArray(ds)
		console.log(selectedAttr, a, crossArray);
		// set products value
		for (var i = 0; i < crossArray.length; i++) {
			let item = crossArray[i].map(function (e) {
				return JSON.parse(e)
			})
			products.push({
				nameArr: item,
				name: item.map(function (e) {
					return e.value
				}).join(' - ')
			})
		}
		// render form html
		createGenetateForm()
	})

	function createGenetateForm() {
		let html = '<table class="table" id="id-generate-form">'
			+ '<thead>'
			+ '<tr>'
				+ '<th scope="col">Product</th>'
				+ '<th scope="col">Price</th>'
				+ '<th scope="col">Qty</th>'
				+ '<th scope="col">Detail</th>'
				+ '<th scope="col">Img</th>'
			+ '</tr>'
			+ '</thead>'
			+ '<tbody>';
			for (let i = 0; i < products.length; i++) {
			html += ' <tr>'
				+ '<th scope="row">' + products[i].name + '</th>'
				+ '<td><input type="number" name="price" class="form-control add"></td>'
				+ '<td><input type="number" name="qty" class="form-control add"></td>'
				+ '<td><textarea name="detail" class="form-control add"></textarea></td>'
				+ '<td>'
					+ '<div class="file-preview"></div>'
					+ '<div class="upload-btn-wrapper">'
					  + '<button class="btn-file">+</button>'
					  + '<input type="file" name="file" class="add-file" multiple/>'
					+ '</div>'
					// + '<input type="file" name="file" class="add-file">'
				+ '</td>'
			+ '</tr>'
			}
			html += '</tbody>'
		+ '</table>'
		+ '<div>'
			+ '<button type="button" class="btn btn-outline-secondary" id="save">Save</button>'
			+ '</div>'
		$('#generate-form').append(html)
	}

	function clearGenerateForm() {
		$("#generate-form").html("");
		crossArray = [];
		products = [];
	}

	$(document).on('paste keyup', '.add', function(e) {
		// console.log($(this).val());
		// console.log($(this).parents('tr')[0].rowIndex);
		let value = $(this).val()
		let name = $(this).attr('name')
		let index = $(this).parents('tr')[0].rowIndex - 1
		products[index][name] = value
	});

	var files = {}

	$(document).on('change', '.add-file', function(e) {

		let index = $(this).parents('tr')[0].rowIndex - 1
		if (e.target.files) {
			files[index] = Array.from(e.target.files)
      renderPreviewImage(index, e.target.files)
    }

		// let file = e.target.files[0]
		
		// let formData = new FormData();
		// formData.append('file', file);


		// var reader = new FileReader();
    
  //   reader.onload = function(e) {
		// 	let pewview = document.getElementsByClassName('file-preview')[index]
		// 	pewview.innerHTML = ''
		// 	// for (let i = 0; i < images.length; i++) {
		// 	// 	images[i]
		// 		pewview.innerHTML += '<div class="item-file-preview">'
		// 			+ '<img src="' + e.target.result + '" width="100">'
		// 			+ '<button type="button" class="close btn-remove-file-preview" data-index="'+1+'"><span aria-hidden="true">&times;</span></button>'
		// 		+ '</div>'
		// 	// }
  //   }
    
  //   reader.readAsDataURL(e.target.files[0]);

		// $.ajax({
		// 	url: '/admincp/upload',
		// 	type: 'POST',
		// 	data: formData,
		// 	cache: false,
		// 	contentType: false,
		// 	processData: false,
		// })
		// .done(function(response) {
		// 	console.log("success", response, products, index);
		// 	if (!products[index]['files']) {
		// 		products[index]['files'] = []
		// 	}
		// 	products[index]['files'].push(response)
		// 	renderPreviewImage(index, products[index]['files'])
		// })
		// .fail(function(error) {
		// 	console.log("error", error);
		// })
		// .always(function() {
		// 	console.log("complete");
		// });
	})

	$(document).on('click', '.btn-remove-file-preview', function(e) {
		let row = $(this).parents('tr')
		let index = row[0].rowIndex - 1
		var imfIndex = $(this).data('index')
		files[index].splice($(this).data('index'), 1)

		// products[index]['files'].splice($(this).data('index'), 1);
		// files[index]

		renderPreviewImage(index, files[index])
	})

	function renderPreviewImage(index, files) {
		var filesAmount = files.length;
		let pewview = document.getElementsByClassName('file-preview')[index]
		pewview.innerHTML = ''

    for (let i = 0; i < filesAmount; i++) {
      var reader = new FileReader();

      reader.onload = function(event) {
        pewview.innerHTML += '<div class="item-file-preview">'
					+ '<img src="' + event.target.result + '" width="100">'
					+ '<button type="button" class="close btn-remove-file-preview" data-index="'+i+'"><span aria-hidden="true">&times;</span></button>'
				+ '</div>'
      }

      reader.readAsDataURL(files[i]);
    }
	}

	$(document).on('click', '#save', function(e) {
		let p = []
		Object.keys(files).map(function (key, index) {
			p[key] = false
			let promises = [];
			for (let i = 0; i < files[key].length; i++) {
				
				let formData = new FormData();
				formData.append('file', files[key][i]);
				promises.push(
					$.ajax({
						url: '/admincp/upload',
						type: 'POST',
						data: formData,
						cache: false,
						contentType: false,
						processData: false,
					})
				)
			}

			Promise.all(promises).then(function (res) {
				p[key] = true
				products[key]['files'] = res
				if (!p.includes(false)) {
					$.ajax({
						url: '/admincp/product/store',
						type: 'POST',
						data: {
							products: products,
							product_lot: product_lot,
						},
					})
					.done(function() {
						window.location.href = '/admincp/product'
					})
					.fail(function() {
						console.log("error");
					})
					.always(function() {
						console.log("complete");
					});
				}
			});
		})
	})

	function crossJoinArray(arr) {
		return arr.reduce(function(a,b){
			return a.map(function(x){
				return b.map(function(y){
					return x.concat(y);
				})
			}).reduce(function(a,b){
				return a.concat(b)
			}, [])
		}, [[]])
	}
