
var blocks = 0;

$.extend($.Isotope.prototype, {

    _categoryRowsReset: function () {
        this.categoryRows = {
            x: 0,
            y: 0,
            height: 0,
            currentCategory: null
        };
    },

    _categoryRowsLayout: function ($elems) {
        var instance = this,
            containerWidth = this.element.width(),
            sortBy = this.options.sortBy,
            props = this.categoryRows;

        $elems.each(function () {
            var $this = $(this),
                atomW = $this.outerWidth(true),
                atomH = $this.outerHeight(true),
                category = $.data(this, 'isotope-sort-data')[sortBy],
                x, y;

            if (category !== props.currentCategory) {
                // new category, new row
                props.x = 0;
                props.height += props.currentCategory ? instance.options.categoryRows.gutter : 0;
                props.y = props.height;
                props.currentCategory = category;
            } else if (props.x !== 0 && atomW + props.x > containerWidth) {
                // if this element cannot fit in the current row
                props.x = 0;
                props.y = props.height;
            }

            // position the atom
            instance._pushPosition($this, props.x, props.y);

            props.height = Math.max(props.y + atomH, props.height);
            props.x += atomW;

        });
    },

    _categoryRowsGetContainerSize: function () {
        return { height: this.categoryRows.height };
    },

    _categoryRowsResizeChanged: function () {
        return true;
    }

});

$(window).load(function () {
    var blocks = $('.contents');

    blocks.isotope({
        itemSelector: '.block',
        layoutMode: 'masonry',
        masonry: { columnWidth: 1 },
        filter: '.block',
        getSortData: { sort: function ($elem) { return parseInt($elem.data('sort') || 4); } },
        sortBy: 'sort'
    });

    $(window).bind('hashchange', function (event) {
        var hashOptions = window.location.hash ? $.deparam.fragment(window.location.hash, true) : {};
        var id = hashOptions['id'] || 0;
        var value = 0;
        var filter = '.beanstory-sortbar';

        if (hashOptions['sort']) {
            value = hashOptions['sort'];

            if (value == 'blog') {
                filter += ', .beanstory-blog';
            } else if (value == 'webtoon') {
                filter += ', .beanstory-webtoon';
            } else {
                filter = '.block';
            }
            filter += ', .footer';
        } else {
            filter = '.block';
        }
        blocks = $('.contents');

        blocks.isotope({
            filter: filter
        });
    }).trigger('hashchange');
});