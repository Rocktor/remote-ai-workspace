window.catalog = [
  {
    id: 'personal',
    name: '个人专属账号',
    image: 'media/fabric.webp',
    alt: '冷色灯光下的银色开发主机',
    summary: '月费含个人 Claude 订阅和云端开发环境，我们协助开通所选档位。用你自己的账号登录，继续上次的项目。',
    caption: '项目在云端，进度跟着你。',
    captionDetail: '在终端或约定的远程桌面里，回到同一份工作目录。',
    tiers: [
      {id:'pro', name:'Pro', price:1000, fit:'日常使用', description:'适合间歇使用 Claude Code，阅读项目、修改脚本或处理小任务。'},
      {id:'max', name:'Max', price:2500, fit:'持续开发', description:'适合每天开发、反复调试和运行测试，比 Pro 有更高的使用额度。'},
      {id:'ultra', name:'Ultra', price:4000, fit:'高强度任务', description:'适合一周内频繁使用 Claude Code、处理较长的开发任务。具体可用额度以账号显示为准。'}
    ],
    access: '账号由你本人登录、使用和保管。你决定哪些仓库、工具和资料可以接入工作空间。',
    steps: [
      ['选好套餐','保存配置清单，留下要开的档位、常用工具和项目需要的空间。'],
      ['确认环境','核对使用地区、开通条件、可用资源、接入方式和服务起算日。'],
      ['登录验收','本人登录账号，运行一项测试，再断开重连，确认项目文件可以取回。']
    ]
  },
  {
    id: 'team',
    name: '团队协作空间',
    image: 'media/desk.webp',
    alt: '工作室桌面上的宽屏显示器与开发工作区',
    summary: '在同一组织的 Claude Team 工作区里协作。每位成员用自己的账号登录，管理员统一分配席位与访问权限。',
    caption: '一起做项目，各自登录。',
    captionDetail: '按成员的工作量搭配席位，把项目交给有权限的人。',
    tiers: [
      {id:'standard', name:'Standard', price:1000, fit:'标准席', description:'面向日常使用 Claude Code 的成员。'},
      {id:'premium', name:'Premium', price:2500, fit:'高级席', description:'面向需要更高使用额度的成员。'}
    ],
    access: '每位成员使用自己的具名席位，使用额度按人计算。组织管理员管理成员和席位，项目资料按实际分配的权限访问。',
    steps: [
      ['搭配席位','确定标准席与高级席人数，保存团队配置清单。'],
      ['确认开通','由组织联系人确认服务地区、成员身份、可用资源及项目访问范围。'],
      ['成员验收','每位成员用自己的账号登录，核对席位、项目目录、访问权限和成果导出方式。']
    ]
  }
];
