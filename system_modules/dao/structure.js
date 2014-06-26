//系统的模块结构
var structure = [
    {
        name: '个人空间',
        id: 2,
        route: '/person',
        sub: [{
                name: '首页',
                id: 21,
                route: '/person',
                sub: []
            }
        ]
    },
    {
        name: '系统管理',
        id: 1,
        route: '/user',
        sub: [
            {
                name: '用户与权限',
                id: 11,
                route: '',
                sub: [
                    {
                        name: '用户管理',
                        id: 111,
                        route: '/user',
                        sub: [{
                                name: '添加',
                                route: '/useradd'
                            }, {
                                name: '删除',
                                route: '/userDelete'
                            }, {
                                name: '编辑',
                                route: '/userEdit'
                            }]
                    },
                    {
                        name: '用户权限',
                        id: 112,
                        route: '/role'
                    },
                    {
                        name: '部门管理',
                        id: 113,
                        route: '/department'
                    }
                ]
            },
            {
                name: '服务器管理',
                id: 112,
                route: '',
                sub: []
            }
        ]
    },
    {
        name: '账号管理',
        id: 3,
        route: '/sinasearch',
        sub: [
            {
                name: '新浪账号',
                id: 31,
                route: '',
                sub: [
                    {
                        name: '账号查询',
                        id: 311,
                        route: '/sinasearch'
                    },
                    {
                        name: '账号导入',
                        id: 312,
                        route: '/sinaloadin'
                    }
                ]
            }
        ]
    },
    {
        name: '引导系统',
        id: 4,
        route: '/newscommmit',
        sub: [
            {
                name: '新闻引导',
                id: 41,
                route: '/newscommmit',
                sub: [
                    {
                        name: '新闻评论',
                        id: 411,
                        route: '/newscommmit',
                        sub: [
                            {
                                name: '详情',
                                route: '/newscommmitdetail'
                            }, {
                                name: '删除',
                                route: '/newscommmitdetele'
                            }, {
                                name: 'stop',
                                route: '/newscommmitstop'
                            }, {
                                name: 'start',
                                route: '/newscommmitstart'
                            },{
                            
                                name: '新建',
                                route: '/newscommmitNew'
                            }
                        ]

                    },
                    {
                        name: '新闻支持',
                        id: 412,
                        route: '/newssupport',
                        sub:[
                            {
                                name: '详情',
                                route: '/newssupportdetail'
                            }, {
                                name: '删除',
                                route: '/newssupportdetele'
                            }, {
                                name: 'stop',
                                route: '/newssupportstop'
                            }, {
                                name: 'start',
                                route: '/newssupportstart'
                            }
                        ]
                        
                    },{
                        name: '新建支持任务',
                        id: 413,
                        route: '/newssupportNew'
                    }

                ]
            }
        ]

    }
];

module.exports = structure;