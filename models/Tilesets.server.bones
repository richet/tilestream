var tilelive = require('@mapbox/tilelive');

// Server-side sync method for Tileset model.
models.Tilesets.prototype.sync = function(method, model, success, error) {
    if (method !== 'read') return error(new Error('Unsupported method.'));

    var filepath = Bones.plugin.config.tiles + model.options.basepath;
    tilelive.all(filepath, function(err, data) {
        if (err) return error(err);
        data = _(data).map(function(tileset) {
            var err = tilelive.verify(tileset);
            if (err) {
                tileset.error = err.message;
            }
            return models.Tileset.syncread(tileset, model.options);
        });
        return success(data);
    });
};
