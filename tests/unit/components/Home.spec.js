import { shallowMount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';
import Home from '@/views/Home.vue';

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(ElementUI);

const routes = [
    { path: '/', name: 'home' },
    { path: '/about', name: 'about' },
    { path: '/login', name: 'login' },
    { path: '/register', name: 'register' }
];

const router = new VueRouter({ routes });

describe('Home.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(Home, {
            localVue,
            router
        });
    });

    it('renders the navigation bar', () => {
        expect(wrapper.find('nav').exists()).toBe(true);
    });

    it('displays the logo with correct text', () => {
        expect(wrapper.find('.logo').text()).toContain('这里是logo');
    });

    it('navigates to home when clicking "首页"', async () => {
        const homeLink = wrapper.findAll('.nav-item').at(0);
        await homeLink.trigger('click');
        expect(wrapper.vm.$route.name).toBe('home');
    });

    it('navigates to about when clicking "关于"', async () => {
        const aboutLink = wrapper.findAll('.nav-item').at(1);
        await aboutLink.trigger('click');
        expect(wrapper.vm.$route.name).toBe('about');
    });

    it('navigates to login when clicking "登录"', async () => {
        const loginLink = wrapper.findAll('.nav-item').at(2);
        await loginLink.trigger('click');
        expect(wrapper.vm.$route.name).toBe('login');
    });

    it('navigates to register when clicking "注册"', async () => {
        const registerLink = wrapper.findAll('.nav-item').at(3);
        await registerLink.trigger('click');
        expect(wrapper.vm.$route.name).toBe('register');
    });

    it('checks if footer contains correct text', () => {
        expect(wrapper.find('footer').text()).toContain('网站主要使用的技术栈：');
    });
});
