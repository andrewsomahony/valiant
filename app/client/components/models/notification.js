'use strict';

var registerModel = require('models/register');

var classy = require('classy');

var name = 'models.notification';

registerModel(name, [require('models/base'),
function(BaseModel) {
   return classy.define({
      extend: BaseModel,
      alias: name,
      
      statics: {
         fields: function() {
            return this.staticMerge(this.callSuper(), {
               kind: "",
               type: "",
               creator: {__alias__: "models.user"},
               parent: null,
               is_new: true,
               is_unread: true,
            });
         },
         localFields: function() {
            return this.staticMerge(this.callSuper(),
               ["parent", "creator", "text"]);
         },
         serverMappings: function() {
            return this.staticMerge(this.callSuper(),
               {
                  "creator": "_creator",
                  "parent": "_parent"
               }
            );
         }
      },
      
      init: function(config, isFromServer) {
         this.callSuper();

         this.initializeManualField("parent", isFromServer);

         if ('question_comment' === this.kind) {
            this.text = "commented on your question";
         }
      }
   });
}])

module.exports = name;