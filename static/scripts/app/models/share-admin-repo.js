define([
    'underscore',
    'backbone',
    'common'
], function(_, Backbone, Common) {
    'use strict';

    var ShareAdminRepo = Backbone.Model.extend({

        getWebUrl: function() {
            var repo_id = this.get('repo_id');
            var dirent_path = this.get('path');
            return "#common/lib/" + repo_id + Common.encodePath(dirent_path);
        },

        getIconUrl: function(size, current_page) {
            if (current_page == 'share-admin-repos') {
                var is_encrypted = this.get('encrypted');
                var is_readonly = this.get('share_permission') == "r" ? true : false;
                return Common.getLibIconUrl(is_encrypted, is_readonly, size);
            } else if (current_page == 'share-admin-folders') {
                return Common.getDirIconUrl(false, size);
            }
        },

        getIconTitle: function() {
            var icon_title = '';
            if (this.get('encrypted')) {
                icon_title = gettext("Encrypted");
            } else if (this.get('share_permission') == "rw") {
                icon_title = gettext("Read-Write");
            } else {
                icon_title = gettext("Read-Only");
            }

            return icon_title;
        }

    });

    return ShareAdminRepo;
});
