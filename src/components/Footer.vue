<template>
  <footer class="py-8">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row items-center justify-between">
        <div class="text-center md:text-left mb-4 md:mb-0">
          <p class="text-sm text-gray-600">
            &copy; {{ new Date().getFullYear() }} Ticketi &mdash; All Rights Reserved
          </p>
        </div>
        <div class="flex items-center gap-6">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-gray-700">
            <Twitter class="w-6 h-6" />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-gray-700">
            <Github class="w-6 h-6" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-gray-700">
            <Linkedin class="w-6 h-6" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Twitter, Github, Linkedin } from "lucide-vue-next";
</script>
