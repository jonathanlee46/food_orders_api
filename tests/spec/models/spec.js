describe('Order Model', function() {
	var MOCK_GET_DATA = {
		name: 'Jack',
    food: 'Cheese',
    postId: 24,
    modelId: 1,
	};

	var MOCK_POST_DATA = {
		success: true
	};

	it('should be able to create its application test objects', function() {
		var pizzaModel = new Order();
		expect(pizzaModel).toBeDefined();
		expect(MOCK_GET_DATA).toBeDefined();
		expect(MOCK_POST_DATA).toBeDefined();
	})

	describe('has property getter functions that', function() {
		var order = new Order(MOCK_GET_DATA);

		it('should return the correct name', function() {
			expect(order.getName()).toEqual('Jack');
		});

		it('should return the correct food', function() {
			expect(order.getFood()).toEqual('Cheese');
		});

		it('should return the post ID', function() {
			expect(order.getPostId()).toEqual(24);
		});

		it('should return the model ID', function() {
			expect(order.getModelId()).toEqual(1);
		});
	});

	describe('when it fetches', function() {
		var order;

		beforeEach(function() {
			// spyOn($, 'ajax').andCallFake(function(options) {
			// 	options.success(MOCK_GET_DATA);
			// });

			order = new Order();
			order.fetch();
		});

		afterEach(function() {
			order = undefined;
		});

		it('should call through to .ajax with proper params', function() {
			var ajaxCallParams = $.ajax.mostRecentCall.args[0];

			expect(ajaxCallParams.dataType).toEqual('json');
			expect(ajaxCallParams.type).toEqual('GET');
			expect(ajaxCallParams.success).toBeDefined();
		});

		it('should be able to parse mocked service response', function() {
			expect(_.isEmpty(order.attributes)).toEqual(false);
			expect(order.get('name')).toEqual('Jack');
			expect(order.get('food')).toEqual('Cheese');
			expect(order.get('postId')).toEqual(24);
			expect(order.get('modelId')).toEqual(1);
		});
	});

});