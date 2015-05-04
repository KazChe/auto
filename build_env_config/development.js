
exports.app = app = {
    title: 'node-boot',
    host: '10.10.50.19',
    port: 9000,
    ssl: false,
    cluster: false
}

exports.service_call_base_url = {
    host: '10.10.50.19',
    port: 8080
}

exports.couchbase = {
    host: '10.10.50.19:8091',
    bucket: 'merchant',
    connectionTimeout: '10000'
}

exports.randomGenrator = {
    serverId: 11
}

exports.modalConfig= {
    authURL: '/ap-services/rest/admin/v1/login',
    ahSearchURL: '/qsupport/search/accountHolder',
    productionJS: 'document.write(\'<script src="http://10.10.50.18:9000/js/production.min.js"></script>\');'
}
