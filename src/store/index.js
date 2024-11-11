// store.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        curEmp: JSON.parse(sessionStorage.getItem('curEmp')) || null, // 从 localStorage 初始化
    },
    mutations: {
        setCurEmp(state, emp) {
            state.curEmp = emp;
            sessionStorage.setItem('curEmp', JSON.stringify(emp)); // 保存到 localStorage
        }
    },
    actions: {
        updateCurEmp({ commit }, emp) {
            commit('setCurEmp', emp);
        }
    },
    getters: {
        getCurEmp: state => state.curEmp,
    }
});