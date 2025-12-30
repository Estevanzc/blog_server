users = {
    name
    email
    password
    birth
    description
    dark_mode
    banner
    photo
},
blogs = {
    name
    subname
    description
    category_id
},
follower = {
    user_id
    blog_id
},
member = {
    role
    user_id
    blog_id
},
posts = {
    title
    subtitle
    summary
    member_id
    blog_id
    banner
},
post_views = {
    user_id
    post_id
},
post_likes = {
    user_id
    post_id
},
categories = {
    name
},
tags = {
    name
},
post_tags = {
    post_id
    tag_id
},
preferences = {
    keyword
    user_id
},
post_contents = {
    post_id
    type
    content
    order
},

npx sequelize-cli model:generate --name Blog --attributes name:string,subname:string,description:text,category_id:integer