<template>
    <header>
        <NuxtLink to="/">
            <NuxtLogo style="width: 50px;" />
        </NuxtLink>
        <nav class="nav-links">
            <NuxtLink to="./daily-update">Daily Task Update</NuxtLink>
            <NuxtLink to="./personal-leave">Personal Leave</NuxtLink>
        </nav>
        <Nuxt/>
    </header>
</template>

<style scoped>
    header {
        
    }
    nav {
        float: right;
        margin: 0 -5px;
    }
    a {
        margin: 0 5px;
    }
</style>