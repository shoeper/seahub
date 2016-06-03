define([
    'jquery',
    'underscore',
    'backbone',
    'common',
    'app/collections/share-admin-repos',
    'app/views/share-admin-repo'
], function($, _, Backbone, Common, ShareAdminRepoCollection, ShareAdminRepoView) {
    'use strict';

    var ShareAdminReposView = Backbone.View.extend({

        id: 'share-admin-repos',

        template: _.template($('#share-admin-repos-tmpl').html()),

        initialize: function() {
            this.repos = new ShareAdminRepoCollection();
            this.listenTo(this.repos, 'add', this.addOne);
            this.listenTo(this.repos, 'reset', this.reset);
            this.render();
        },

        events: {
            'click .by-name': 'sortByName'
        },

        sortByName: function() {
            var repos = this.repos;
            var el = $('.by-name .sort-icon', this.$table);
            repos.comparator = function(a, b) { // a, b: model
                var result = Common.compareTwoWord(a.get('repo_name'), b.get('repo_name'));
                if (el.hasClass('icon-caret-up')) {
                    return -result;
                } else {
                    return result;
                }
            };
            repos.sort();
            this.$tableBody.empty();
            repos.each(this.addOne, this);
            el.toggleClass('icon-caret-up icon-caret-down').show();
            repos.comparator = null;
            return false;
        },

        render: function() {
            this.$el.html(this.template({'current_page': this.current_page}));
            this.$table = this.$('table');
            this.$tableBody = $('tbody', this.$table);
            this.$loadingTip = this.$('.loading-tip');
            this.$emptyTip = this.$('.empty-tips');
        },

        hide: function() {
            this.$el.detach();
            this.attached = false;
        },

        show: function(option) {
            this.current_page = option.current_page;
            if (!this.attached) {
                this.attached = true;
                $("#right-panel").html(this.$el);
            }
            this.showLibraries();
        },

        showLibraries: function() {
            this.initPage();
            var _this = this,
                url = this.repos.url();

            if (this.current_page == 'share-admin-folders') {
                url = url + '?is_virtual=1';
            }

            this.repos.fetch({
                url: url,
                cache: false, // for IE
                reset: true,
                error: function (xhr) {
                    Common.ajaxErrorHandler(xhr);
                }
            });
        },

        initPage: function() {
            this.$table.hide();
            this.$tableBody.empty();
            this.$loadingTip.show();
            this.$emptyTip.hide();
        },

        reset: function() {
            this.$('.error').hide();
            this.$loadingTip.hide();
            if (this.repos.length) {
                this.$emptyTip.hide();
                this.$tableBody.empty();
                this.repos.each(this.addOne, this);
                this.$table.show();
            } else {
                if (this.current_page == 'share-admin-repos') {
                    this.$('.share-admin-repos-empty-tips').show();
                } else {
                    this.$('.share-admin-folders-empty-tips').show();
                }
                this.$table.hide();
            }
        },

        addOne: function(repo) {
            var view = new ShareAdminRepoView({model: repo, current_page: this.current_page});
            this.$tableBody.append(view.render().el);
        }

    });

    return ShareAdminReposView;
});
