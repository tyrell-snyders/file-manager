APP_NAME = file-manager

all: build

install:
	npm install

build:
	npm run build

run-windows:
	npm run tauri dev 

run-android:
	