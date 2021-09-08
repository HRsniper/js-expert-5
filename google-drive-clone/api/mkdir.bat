@echo off

if not exist downloads (
  mkdir downloads
  echo "downloads folder has been successfully created"
) else (
  echo "downloads folder already exists"
)
