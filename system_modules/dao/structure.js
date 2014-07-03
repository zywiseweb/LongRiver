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
                        sub: [
                            {
                                id:1111,
                                name: '删除',
                                route: '/userDelete'
                            }, {
                                id:1112,
                                name: '编辑',
                                route: '/userEdit'
                            }]
                    },
                    {
                        name: '创建用户',
                        id: 114,
                        route: '/adduser'
                    },
                    {
                        name: '用户权限',
                        id: 112,
                        route: '/role'
                    },
                    {
                        name: '部门管理',
                        id: 113,
                        route: '/department',
                        sub:[
                            {
                                id:1131,
                                route: '/departmentSave'
                            }
                        ]
                        
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
                                id:4111,
                                name: '详情',
                                route: '/newscommmitdetail'
                            }, {
                                 id:4112,
                                name: '删除',
                                route: '/newscommmitdetele'
                            }, {
                                 id:4113,
                                name: '停止',
                                route: '/newscommmitstop'
                            }, {
                                 id:4114,
                                name: 'start',
                                route: '/newscommmitstart'
                            },{
                                id:4115,
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

    },
    {
         name: '调度系统',
        id: 5,
        route: '/scheduleClient',
        sub:[
            {
                name: '执行端',
                id: 51,
                route: '/scheduleClient',
                sub: [
                    {
                        name: '在线执行端',
                        id: 511,
                        route: '/scheduleClient'
                        
                    }
                ]
            }
        ]
    },
    {
         name: '长河监控',
        id: 6,
        route: '/lrstatus',
        sub:[
            {
                name: '系统状态',
                id: 61,
                route: '/lrstatus'
                
            },
            {
                name: '新浪账号状态',
                id:62 ,
                route: '/lrsinaAccount',
                sub:[
                    {
                        name: '账号分布',
                        id: 621,
                        route: '/lrsinaAccount'
                        
                    },
                    {
                        name: '24小时账号变化',
                        id: 622,
                        route: '/lrsinaAccount24'
                        
                    }
                ]
            },
            {
                name: '任务统计',
                id:63 ,
                route: '/lrmiss',
                sub:[
                    {
                        name: '任务执行分布',
                        id: 631,
                        route: '/lrmiss'
                        
                    },
                    {
                        name: '30天任务统计',
                        id: 632,
                        route: '/lrmiss30'
                        
                    },
                    {
                        name: '7天任务执行量',
                        id: 633,
                        route: '/lrmiss7'
                        
                    },
                    {
                        name: '单个任务执行情况',
                        id: 633,
                        route: '/lrmissOne'
                        
                    }
                ]
            },
            {
                name: '日志查询',
                id:64 ,
                route: '/lrlog'
                
            }
        ]
    }
];

module.exports = structure;