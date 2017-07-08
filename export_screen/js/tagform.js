var data = ["Amsterdam",
    "London",
    "Paris",
    "Washington",
    "New York",
    "New Jersey",
    "New Orleans",
    "Los Angeles",
    "Sydney",
    "Melbourne",
    "Canberra",
    "Beijing",
    "New Delhi",
    "Kathmandu",
    "Cairo",
    "Cape Town",
    "Kinshasa",
    "maturu"
  ];
var cliptags = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('clip'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: $.map(data, function (tag) {
        return {
            clip: tag
        };
    })
});
cliptags.initialize();

$('.clip-tags-form input').tagsinput({
    typeaheadjs: [{
          minLength: 1,
          highlight: true,
    },{
        minlength: 1,
        name: 'cliptags',
        displayKey: 'clip',
        valueKey: 'clip',
        source: cliptags.ttAdapter()
    }],
    freeInput: true
});
