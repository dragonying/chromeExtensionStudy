/**
 * 封装的方法以及用法
 * 打开数据库
 */
export function openDB(dbName, storeName, version = 1) {
    return new Promise((resolve, reject) => {
        const indexedDB = window.indexedDB
        let db
        const request = indexedDB.open(dbName, version)
        request.onsuccess = function (event) {
            db = event.target.result // 数据库对象
            resolve(db)
        }

        request.onerror = function (event) {
            reject(event)
        }

        request.onupgradeneeded = function (event) {
            // 数据库创建或升级的时候会触发
            console.log('onupgradeneeded')
            db = event.target.result // 数据库对象
            let objectStore
            if (!db.objectStoreNames.contains(storeName)) {
                objectStore = db.createObjectStore(storeName, { keyPath: 'id' }) // 创建表
                // objectStore.createIndex('name', 'name', { unique: true }) // 创建索引 可以让你搜索任意字段
            }
        }
    })
}

/**
   * 新增数据
   */
export function addData(db, storeName, data) {
    return new Promise((resolve, reject) => {
        const request = db.transaction([storeName], 'readwrite') // 事务对象 指定表格名称和操作模式（"只读"或"读写"）
            .objectStore(storeName) // 仓库对象
            .add(data)

        request.onsuccess = function (event) {
            resolve(event)
        }

        request.onerror = function (event) {
            reject(event)
            throw new Error(event.target.error)
        }
    })
}

/**
   * 通过主键读取数据
   */
export function getDataByKey(db, storeName, key) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName]) // 事务
        const objectStore = transaction.objectStore(storeName) // 仓库对象
        const request = objectStore.get(key)

        request.onerror = function (event) {
            reject(event)
        }

        request.onsuccess = function (event) {
            resolve(request.result)
        }
    })
}

/**
   * 通过游标读取数据
   */
export function cursorGetData(db, storeName) {
    const list = []
    const store = db.transaction(storeName, 'readwrite') // 事务
        .objectStore(storeName) // 仓库对象
    const request = store.openCursor() // 指针对象
    return new Promise((resolve, reject) => {
        request.onsuccess = function (e) {
            const cursor = e.target.result
            if (cursor) {
                // 必须要检查
                list.push(cursor.value)
                cursor.continue() // 遍历了存储对象中的所有内容
            } else {
                resolve(list)
            }
        }
        request.onerror = function (e) {
            reject(e)
        }
    })
}

/**
   * 通过索引读取数据
   */
export function getDataByIndex(db, storeName, indexName, indexValue) {
    const store = db.transaction(storeName, 'readwrite').objectStore(storeName)
    const request = store.index(indexName).get(indexValue)
    return new Promise((resolve, reject) => {
        request.onerror = function (e) {
            reject(e)
        }
        request.onsuccess = function (e) {
            resolve(e.target.result)
        }
    })
}

/**
   * 通过索引和游标查询记录
   */
export function cursorGetDataByIndex(db, storeName, indexName, indexValue) {
    const list = []
    const store = db.transaction(storeName, 'readwrite').objectStore(storeName) // 仓库对象
    const request = store.index(indexName) // 索引对象
        .openCursor(IDBKeyRange.only(indexValue)) // 指针对象
    return new Promise((resolve, reject) => {
        request.onsuccess = function (e) {
            const cursor = e.target.result
            if (cursor) {
                list.push(cursor.value)
                cursor.continue() // 遍历了存储对象中的所有内容
            } else {
                resolve(list)
            }
        }
        request.onerror = function (ev) {
            reject(ev)
        }
    })
}

/**
   * 更新数据
   */
export function updateDB(db, storeName, data) {
    const request = db.transaction([storeName], 'readwrite') // 事务对象
        .objectStore(storeName) // 仓库对象
        .put(data)

    return new Promise((resolve, reject) => {
        request.onsuccess = function (ev) {
            resolve(ev)
        }

        request.onerror = function (ev) {
            resolve(ev)
        }
    })
}

/**
   * 删除数据
   */
export function deleteDB(db, storeName, id) {
    const request = db.transaction([storeName], 'readwrite').objectStore(storeName).delete(id)

    return new Promise((resolve, reject) => {
        request.onsuccess = function (ev) {
            resolve(ev)
        }

        request.onerror = function (ev) {
            resolve(ev)
        }
    })
}

/**
   * 删除数据库
   */
export function deleteDBAll(dbName) {
    console.log(dbName)
    const deleteRequest = window.indexedDB.deleteDatabase(dbName)
    return new Promise((resolve, reject) => {
        deleteRequest.onerror = function (event) {
            console.log('删除失败')
        }
        deleteRequest.onsuccess = function (event) {
            console.log('删除成功')
        }
    })
}

/**
   * 关闭数据库
   */
export function closeDB(db) {
    db.close()
    console.log('数据库已关闭')
}

export default {
    openDB,
    addData,
    getDataByKey,
    cursorGetData,
    getDataByIndex,
    cursorGetDataByIndex,
    updateDB,
    deleteDB,
    deleteDBAll,
    closeDB
}