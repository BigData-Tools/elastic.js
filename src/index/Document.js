  /**
    @class
    <p>The <code>Document</code> object provides an interface for working with
    Documents.  Some example operations avaiable are storing documents,
    retreiving documents, updating documents, and deleting documents from an
    index.</p>

    @name ejs.Document

    @desc
    Object used to create, replace, update, and delete documents

    <div class="alert-message block-message info">
        <p>
            <strong>Tip: </strong>
            It is not necessary to first create a index or content-type. If either of these
            do not exist, they will be automatically created when you attempt to store the document.
        </p>
    </div>
    
    @param {String} index The index the document belongs to.
    @param {String} type The type the document belongs to.
    @param {String} id The id of the document.  The id is required except 
      for indexing.  If no id is specified during indexing, one will be
      created for you.
      
    */
  ejs.Document = function (index, type, id) {

    var params = {},
    
      // converts client params to a string param1=val1&param2=val1
      genParamStr = function () {
        var clientParams = genClientParams(),
        parts = [];
        
        for (var p in clientParams) {
          if (!has(clientParams, p)) {
            continue;
          }
          
          parts.push(p + '=' + encodeURIComponent(clientParams[p]));
        }
        
        return parts.join('&');
      },
      
      // Converts the stored params into parameters that will be passed
      // to a client.  Certain parameter are skipped, and others require
      // special processing before being sent to the client.
      genClientParams = function () {
        var clientParams = {};
        
        for (var param in params) {
          if (!has(params, param)) {
            continue;
          }
          
          // skip params that don't go in the query string
          if (param === 'upsert' || param === 'source' ||
            param === 'script' || param === 'lang' || param === 'params') {
            continue;
          }
                    
          // process all over params
          var paramVal = params[param];
          if (isArray(paramVal)) {
            paramVal = paramVal.join();
          }
            
          clientParams[param] = paramVal;
        }
        
        return clientParams;
      };
      
    return {

      /**
             Sets the index the document belongs to.

             @member ejs.Document
             @param {String} idx The index name
             @returns {Object} returns <code>this</code> so that calls can be chained.
             */
      index: function (idx) {
        if (idx == null) {
          return index;
        }
        
        index = idx;
        return this;
      },
      
      /**
             Sets the type of the document.

             @member ejs.Document
             @param {String} t The type name
             @returns {Object} returns <code>this</code> so that calls can be chained.
             */
      type: function (t) {
        if (t == null) {
          return type;
        }
        
        type = t;
        return this;
      },
      
      /**
             Sets the id of the document.

             @member ejs.Document
             @param {String} i The document id
             @returns {Object} returns <code>this</code> so that calls can be chained.
             */
      id: function (i) {
        if (i == null) {
          return id;
        }
        
        id = i;
        return this;
      },
      
      /**
             Sets the routing value. By default, the shard the document is
             placed on is controlled by using a hash of the document’s id 
             value. For more explicit control, this routing value will be fed 
             into the hash function used by the router.
             
             This option is valid during the following operations:
             index, delete, get, and update.

             @member ejs.Document
             @param {String} route The routing value
             @returns {Object} returns <code>this</code> so that calls can be chained.
             */
      routing: function (route) {
        if (route == null) {
          return params.routing;
        }
        
        params.routing = route;
        return this;
      },
      
      /**
             Sets parent value for a child document.  When indexing a child 
             document, the routing value is automatically set to be the same 
             as it’s parent, unless the routing value is explicitly specified 
             using the routing parameter.
             
             This option is valid during the following operations:
             index, delete, get, and update.

             @member ejs.Document
             @param {String} parent The parent value
             @returns {Object} returns <code>this</code> so that calls can be chained.
             */
      parent: function (parent) {
        if (parent == null) {
          return params.parent;
        }
        
        params.parent = parent;
        return this;
      },
      
      /**
             Sets timestamp of the document.  By default the timestamp will
             be set to the time the docuement was indexed.
             
             This option is valid during the following operations:
             index and update

             @member ejs.Document
             @param {String} parent The parent value
             @returns {Object} returns <code>this</code> so that calls can be chained.
             */
      timestamp: function (ts) {
        if (ts == null) {
          return params.timestamp;
        }
        
        params.timestamp = ts;
        return this;
      },
      
      /**
             Sets the documents time to live (ttl).  The expiration date that 
             will be set for a document with a provided ttl is relative to the 
             timestamp of the document, meaning it can be based on the time of 
             indexing or on any time provided. The provided ttl must be 
             strictly positive and can be a number (in milliseconds) or any 
             valid time value such as "1d", "2h", "5m", etc.
             
             This option is valid during the following operations:
             index and update

             @member ejs.Document
             @param {String} length The amount of time after which the document
              will expire.
             @returns {Object} returns <code>this</code> so that calls can be chained.
             */
      ttl: function (length) {
        if (length == null) {
          return params.ttl;
        }
        
        params.ttl = length;
        return this;
      },
      
      /**
             Set's a timeout for the given operation.  If the primary shard
             has not completed the operation before this value, an error will
             occur.  The default timeout is 1 minute. The provided timeout 
             must be strictly positive and can be a number (in milliseconds) or 
             any valid time value such as "1d", "2h", "5m", etc.
             
             This option is valid during the following operations:
             index, delete, and update

             @member ejs.Document
             @param {String} length The amount of time after which the operation
              will timeout.
             @returns {Object} returns <code>this</code> so that calls can be chained.
             */
      timeout: function (length) {
        if (length == null) {
          return params.timeout;
        }
        
        params.timeout = length;
        return this;
      },
      
      /**
             Enables the index to be refreshed immediately after the operation
             occurs.  This is an advanced setting and can lead to performance
             issues.
             
             This option is valid during the following operations:
             index, delete, get, and update

             @member ejs.Document
             @param {Boolean} trueFalse If the index should be refreshed or not.
             @returns {Object} returns <code>this</code> so that calls can be chained.
             */
      refresh: function (trueFalse) {
        if (trueFalse == null) {
          return params.refresh;
        }
        
        params.refresh = trueFalse;
        return this;
      },
      
      /**
             Sets the document version.  Used for optimistic concurrency 
             control when set.  If the version of the currently indexed
             document is less-than or equal to the version specified, an
             error is produced, otherwise the operation is permitted.
             By default, internal versioning is used that starts at 1 and 
             increments with each update. 
             
             This option is valid during the following operations:
             index, delete, and update

             @member ejs.Document
             @param {Long} version A positive long value
             @returns {Object} returns <code>this</code> so that calls can be chained.
             */
      version: function (version) {
        if (version == null) {
          return params.version;
        }
        
        params.version = version;
        return this;
      },
      
      /**
             Sets the version type.  Possible values are:
             
             internal - the default
             external - to use your own version (ie. version number from a database)
             
             This option is valid during the following operations:
             index, delete, and update

             @member ejs.Document
             @param {String} vt A version type (internal or external)
             @returns {Object} returns <code>this</code> so that calls can be chained.
             */
      versionType: function (vt) {
        // internal or external
        if (vt == null) {
          return params.version_type;
        }
        
        vt = vt.toLowerCase();
        if (vt === 'internal' || vt === 'external') {
          params.version_type = vt;
        }
        
        return this;
      },
      
      /**
             Perform percolation at index time.  Set to * to run document 
             against all registered queries.  It is also possible to set this
             value to a string in query string format, ie. "color:green".
             
             This option is valid during the following operations:
             index and update

             @member ejs.Document
             @param {String} qry A percolation query string
             @returns {Object} returns <code>this</code> so that calls can be chained.
             */
      percolate: function (qry) {
        if (qry == null) {
          return params.percolate;
        }
        
        params.percolate = qry;
        return this;
      },
      
      /**
             Sets the indexing operation type.  Valid values are:
             
             index - the default, create or replace
             create - create only
             
             This option is valid during the following operations:
             index

             @member ejs.Document
             @param {String} op The operation type (index or create)
             @returns {Object} returns <code>this</code> so that calls can be chained.
             */
      opType: function (op) {
        if (op == null) {
          return params.op_type;
        }
        
        op = op.toLowerCase();
        if (op === 'index' || op === 'create') {
          params.op_type = op;
        }
        
        return this;
      },
      
      /**
             Sets the replication mode.  Valid values are:
             
             async - asynchronous replication to slaves
             sync - synchronous replication to the slaves
             default - the currently configured system default. 
             
             This option is valid during the following operations:
             index, delete, and update

             @member ejs.Document
             @param {String} r The replication mode (async, sync, or default)
             @returns {Object} returns <code>this</code> so that calls can be chained.
             */
      replication: function (r) {
        if (r == null) {
          return params.replication;
        }
        
        r = r.toLowerCase();
        if (r === 'async' || r === 'sync' || r === 'default') {
          params.replication = r;
        }
        
        return this;
      },
      
      /**
             Sets the write consistency.  Valid values are:
             
             one - only requires write to one shard
             quorum - requires writes to quorum (N/2 + 1)
             all - requires write to succeed on all shards
             default - the currently configured system default
             
             This option is valid during the following operations:
             index, delete, and update

             @member ejs.Document
             @param {String} c The write consistency (one, quorum, all, or default)
             @returns {Object} returns <code>this</code> so that calls can be chained.
             */
      consistency: function (c) {
        if (c == null) {
          return params.consistency;
        }
        
        c = c.toLowerCase();
        if (c === 'default' || c === 'one' || c === 'quorum' || c === 'all') {
          params.consistency = c;
        }
        
        return this;
      },
      
      /**
             Sets the preference of which shard replicas to execute the get 
             request on. By default, the operation is randomized between the 
             shard replicas.  This value can be:
             
             _primary - execute only on the primary shard
             _local - the local shard if possible
             any string value - to guarentee the same shards will always be used
             
             This option is valid during the following operations:
             get

             @member ejs.Document
             @param {String} p The preference value as a string
             @returns {Object} returns <code>this</code> so that calls can be chained.
             */
      preference: function (p) {
        if (p == null) {
          return params.preference;
        }
        
        params.preference = p;
        return this;
      },
      
      /**
             Sets if the get request is performed in realtime or waits for
             the indexing operations to complete.  By default it is realtime.
             
             This option is valid during the following operations:
             get

             @member ejs.Document
             @param {Boolean} trueFalse If realtime get is used or not.
             @returns {Object} returns <code>this</code> so that calls can be chained.
             */
      realtime: function (trueFalse) {
        if (trueFalse == null) {
          return params.realtime;
        }
        
        params.realtime = trueFalse;
        return this;
      },
      
      /**
             Sets the fields of the document to return.  By default the 
             _source field is returned.  Pass a single value to append to the
             current list of fields, pass an array to overwrite the current
             list of fields.  The returned fields will either be loaded if 
             they are stored, or fetched from the _source
             
             This option is valid during the following operations:
             get and update

             @member ejs.Document
             @param {String || Array} fields a single field name or array of field names.
             @returns {Object} returns <code>this</code> so that calls can be chained.
             */
      fields: function (fields) {
        if (params.fields == null) {
          params.fields = [];
        }
        
        if (fields == null) {
          return params.fields;
        }
        
        if (isString(fields)) {
          params.fields.push(fields);
        } else if (isArray(fields)) {
          params.fields = fields;
        } else {
          throw new TypeError('Argument must be string or array');
        }
        
        return this;
      },
      
      /**
             Sets the update script.
             
             This option is valid during the following operations:
             update

             @member ejs.Document
             @param {String} script a script to use for docuement updates
             @returns {Object} returns <code>this</code> so that calls can be chained.
             */
      script: function (script) {
        if (script == null) {
          return params.script;
        }
        
        params.script = script;
        return this;
      },
      
      /**
             Sets the update script lanauge.  Defaults to mvel.
             
             This option is valid during the following operations:
             update

             @member ejs.Document
             @param {String} lang a valid script lanauge type such as mvel.
             @returns {Object} returns <code>this</code> so that calls can be chained.
             */
      lang: function (lang) {
        if (lang == null) {
          return params.lang;
        }
        
        params.lang = lang;
        return this;
      },
      
      /**
             Sets the parameters sent to the update script.  The params must
             be an object where the key is the parameter name and the value is
             the parameter value to use in the script.  
             
             This option is valid during the following operations:
             update

             @member ejs.Document
             @param {Object} p a object with script parameters.
             @returns {Object} returns <code>this</code> so that calls can be chained.
             */
      params: function (p) {
        // accept object, prefix keys as sp_{key}
        if (p == null) {
          return params.params;
        }
        
        if (!isObject(p)) {
          throw new TypeError('Argument must be an object');
        }
        
        params.params = p;
        return this;
      },
      
       /**
               Sets how many times to retry if there is a version conflict 
               between getting the document and indexing / deleting it. 
               Defaults to 0.

               This option is valid during the following operations:
               update

               @member ejs.Document
               @param {Integer} num the number of times to retry operation.
               @returns {Object} returns <code>this</code> so that calls can be chained.
               */
      retryOnConflict: function (num) {
        if (num == null) {
          return params.retry_on_conflict;
        }
        
        params.retry_on_conflict = num;
        return this;
      },
      
      /**
               Sets the upsert document.  The upsert document is used during
               updates when the specified document you are attempting to 
               update does not exist.

               This option is valid during the following operations:
               update

               @member ejs.Document
               @param {Object} doc the upset document.
               @returns {Object} returns <code>this</code> so that calls can be chained.
               */
      upsert: function (doc) {
        if (doc == null) {
          return params.upsert;
        }
        
        if (!isObject(doc)) {
          throw new TypeError('Argument must be an object');
        }
        
        params.upsert = doc;
        return this;
      },
      
      /**
               Sets the source document.  When set during an update operation,
               it is used as the partial update document.  

               This option is valid during the following operations:
               index and update

               @member ejs.Document
               @param {Object} doc the source document.
               @returns {Object} returns <code>this</code> so that calls can be chained.
               */
      source: function (doc) {
        if (doc == null) {
          return params.source;
        }
        
        if (!isObject(doc)) {
          throw new TypeError('Argument must be an object');
        }
        
        params.source = doc;
        return this;
      },
      
      /**
            <p>Allows you to serialize this object into a JSON encoded string.</p>

            @member ejs.Document
            @returns {String} returns this object as a serialized JSON string.
            */
      toString: function () {
        return JSON.stringify(params);
      },
      
      /**
            The type of ejs object.  For internal use only.
            
            @member ejs.Document
            @returns {String} the type of object
            */
      _type: function () {
        return 'document';
      },
      
      /**
            <p>Retrieves the internal <code>document</code> object. This is 
            typically used by internal API functions so use with caution.</p>

            @member ejs.Document
            @returns {Object} returns this object's internal object.
            */
      _self: function () {
        return params;
      },
      
      /**
            <p>Retrieves a document from the given index and type.</p>

            @member ejs.Document
            @param {Function} fnCallBack A callback function that handles the response.
            @returns {Object} The return value is dependent on client implementation.
            */
      doGet: function (fnCallBack) {
        // make sure the user has set a client
        if (ejs.client == null) {
          throw new Error("No Client Set");
        }
        
        if (index == null || type == null || id == null) {
          throw new Error('Index, Type, and ID must be set');
        }
        
        // we don't need to convert the client params to a string
        // on get requests, just create the url and pass the client
        // params as the data
        var url = '/' + index + '/' + type + '/' + id;
        
        return ejs.client.get(url, genClientParams(), fnCallBack);
      },

      /**
            <p>Stores a document in the given index and type.  If no id 
            is set, one is created during indexing.</p>

            @member ejs.Document
            @param {Function} fnCallBack A callback function that handles the response.
            @returns {Object} The return value is dependent on client implementation.
            */
      doIndex: function (fnCallBack) {
        // make sure the user has set a client
        if (ejs.client == null) {
          throw new Error("No Client Set");
        }
        
        if (index == null || type == null) {
          throw new Error('Index and Type must be set');
        }
        
        if (params.source == null) {
          throw new Error('No source document found');
        }
        
        var url = '/' + index + '/' + type,
          data = JSON.stringify(params.source),
          paramStr = genParamStr(),
          response;
          
        if (id != null) {
          url = url + '/' + id;
        }
        
        if (paramStr !== '') {
          url = url + '?' + paramStr;
        }
        
        // do post if id not set so one is created
        if (id == null) {
          response = ejs.client.post(url, data, fnCallBack);
        } else {
          // put when id is specified
          response = ejs.client.put(url, data, fnCallBack);
        }
        
        return response;
      },

      /**
            <p>Updates a document in the given index and type.  If the 
            document is not found in the index, the "upsert" value is used
            if set.  The document is updated via an update script or partial
            document.  To use a script, set the script option, to use a 
            partial document, set the source with the partial document.</p>

            @member ejs.Document
            @param {Function} fnCallBack A callback function that handles the response.
            @returns {Object} The return value is dependent on client implementation.
            */
      doUpdate: function (fnCallBack) {
        // make sure the user has set a client
        if (ejs.client == null) {
          throw new Error("No Client Set");
        }
        
        if (index == null || type == null || id == null) {
          throw new Error('Index, Type, and ID must be set');
        }
        
        if (params.script == null && params.source == null) {
          throw new Error('Update script or document required');
        }
        
        var url = '/' + index + '/' + type + '/' + id + '/_update',
          data = {},
          paramStr = genParamStr();
        
        if (paramStr !== '') {
          url = url + '?' + paramStr;
        }
        
        if (params.script != null) {
          data.script = params.script;
        }
        
        if (params.lang != null) {
          data.lang = params.lang;
        }
        
        if (params.params != null) {
          data.params = params.params;
        }
        
        if (params.upsert != null) {
          data.upsert = params.upsert;
        }
        
        if (params.source != null) {
          data.doc = params.source;
        }
        
        return ejs.client.post(url, JSON.stringify(data), fnCallBack);
      },

      /**
            <p>Deletes the document from the given index and type using the 
            speciifed id.</p>

            @member ejs.Document
            @param {Function} fnCallBack A callback function that handles the response.
            @returns {void} Returns the value of the callback when executing on the server.
            */
      doDelete: function (fnCallBack) {
        // make sure the user has set a client
        if (ejs.client == null) {
          throw new Error("No Client Set");
        }
        
        if (index == null || type == null || id == null) {
          throw new Error('Index, Type, and ID must be set');
        }
        
        var url = '/' + index + '/' + type + '/' + id,
          data = '',
          paramStr = genParamStr();
        
        if (paramStr !== '') {
          url = url + '?' + paramStr;
        }
        
        return ejs.client.del(url, data, fnCallBack);
      }

    };
  };

