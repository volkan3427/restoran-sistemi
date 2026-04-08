@echo off
chcp 65001 >nul
echo.
echo =======================================================
echo          SITE GUNCELLEME ISLEMI BASLATILIYOR...
echo =======================================================
echo.

git add .
git commit -m "Sistem güncellendi"
git push

echo.
echo =======================================================
echo ISLEM TAMAMLANDI!
echo Kodlarin basariyla yuklendi.
echo Github Pages 1-2 dakika icinde siteni otomatik olarak yenileyecek.
echo =======================================================
echo.
pause
