window.dom = {
    create(string) { //创建节点，输入create("<div><span>你好</span></div>")，自动创建该内容
        const container = document.createElement("template");   //template,这个标签可以容纳所有标签
        container.innerHTML = string.trim();  //.trim(),用来去掉多余空格
        return container.content.firstChild;
    },
    after(node, node2) { //在node节点后新增node2节点
        node.parentNode.insertBefore(node2, node.nextSibling); //把node2添加到node的下一个节点之前
    },
    before(node, node2) { //在node节点前新增node2节点
        node.parentNode.insertBefore(node2, node);
    },
    append(parent, node) { //在parent父节点中新增node子节点
        parent.appendChild(node)
    },
    wrap(node, parent) { //在node子节点上新增parent父节点
        dom.before(node, parent) //新增parent放到node前面
        dom.append(parent, node) //把node放到刚刚新增的parent里
    },
    remove(node) { //删除节点
        node.parentNode.removeChild(node)
        return node
    },
    empty(node) { //删除后代
        const array = [] //遍历子节点然后remove
        let x = node.firstChild
        while (x) {
            array.push(dom.remove(node.firstChild))
            x = node.firstChild
        }
        return array
    },
    attr(node, name, value) { //根据参数的个数，实现不同的函数，这叫重载
        if (arguments.length === 3) {
            node.setAttribute(name, value) //三个参数，修改node的name改为value
        } else if (arguments.length === 2) {
            return node.getAttribute(name) //两个参数，读取node的name
        }
    },
    text(node, string) { // 适配
        if (arguments.length === 2) { //两个参数，写文本内容 node.innerText = string
            if ('innerText' in node) { //这里的if-else是适配浏览器
                node.innerText = string
            } else {
                node.textContent = string
            }
        } else if (arguments.length === 1) { //一个参数，读取文本内容
            if ('innerText' in node) { //这里的if-else是适配浏览器
                return node.innerText
            } else {
                return node.textContent
            }
        }
    },
    html(node, string) { //读写html内容
        if (arguments.length === 2) { //两个参数写内容
            node.innerHTML = string
        } else if (arguments.length === 1) { //一个参数读内容
            return node.innerHTML
        }
    },
    style(node, name, value) { //用于修改style
        if (arguments.length === 3) {
            // dom.style(div, 'color', 'red')
            node.style[name] = value //node.style的name=value
        } else if (arguments.length === 2) {
            if (typeof name === 'string') {
                // dom.style(div, 'color')
                return node.style[name] //name为字符串，读取这个属性
            } else if (name instanceof Object) {
                // dom.style(div, {color: 'red'})
                const object = name //name为对象，传一个对象，设置多个属性
                for (let key in object) {
                    node.style[key] = object[key]
                } //遍历对象，依次设置属性
            }
        }
    },
    class: {
        add(node, className) { //添加class
            node.classList.add(className)
        },
        remove(node, className) { //删除class
            node.classList.remove(className)
        },
        has(node, className) {  //查找是否有class
            return node.classList.contains(className)
        }
    },
    on(node, eventName, fn) { //添加事件监听
        node.addEventListener(eventName, fn)
    },
    off(node, eventName, fn) { //删除事件监听
        node.removeEventListener(eventName, fn)
    },
    find(selector, scope) { //获取标签
        return (scope || document).querySelectorAll(selector)  //在指定区域/全局内获取标签
    },
    parent(node) { //获取父元素
        return node.parentNode
    },
    children(node) { //获取子元素
        return node.children
    },
    siblings(node) { //获取兄弟元素
        return Array.from(node.parentNode.children)
            .filter(n => n !== node)  //找到父元素下的子元素，并除开自己
    },
    next(node) { //获取弟弟元素
        let x = node.nextSibling
        while (x && x.nodeType !== 1) { //如果x存在且x不是html元素节点，就继续查找下一个
            x = x.nextSibling
        }
        return x
    },
    previous(node) { //获取哥哥元素
        let x = node.previousSibling
        while (x && x.nodeType !== 1) {
            x = x.previousSibling
        }
        return x
    },
    each(nodeList, fn) { //遍历所有节点
        for (let i = 0; i < nodeList.length; i++) {
            fn.call(null, nodeList[i])
        }
    },
    index(node) { //获取排行老几
        const list = dom.children(node.parentNode)
        let i
        for (i = 0; i < list.length; i++) {
            if (list[i] === node) {
                break
            }
        }
        return i
    }
};
