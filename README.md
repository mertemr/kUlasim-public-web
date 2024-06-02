# kUlaşım Web

### Şehir İçi Ulaşım için Proje Web Sitesi
Bu proje, şehir içi ulaşım ihtiyaçlarını karşılamak için geliştirilen bir Node.js uygulamasıdır. Proje, ulaşım güzergahlarını hesaplamak için OpenRouteService API'sini kullanır. 

Docker kullanılarak uygulamanın kolayca başlatılması sağlanmıştır.

## Gereksinimler
Bu projeyi çalıştırabilmek için aşağıdaki yazılımların kurulu olması gerekmektedir:  
**Node.js** (>= 14.x) veya [Docker](https://docs.docker.com/get-docker/)

## Çevre Değişkenleri
Haritadan güzergahlara erişebilmek için .env dosyasına aşağıdaki değişkenleri ekleyin:

```env
OPENROUTE_SERVICE_API=api_anahatariniz
```

## Yerelde Kurulum
Gerekli Node.js paketlerini kurun:
```bash
npm install
```

Proje dizininde aşağıdaki komutu çalıştırarak uygulamayı başlatabilirsiniz:
```bash
npm run start
```
Bu komut, uygulamayı 8000 numaralı portta başlatacaktır.

## Yerelde Docker Kurulumu
Docker ile uygulamayı başlatmak için öncelikle Docker imajını oluşturmanız gerekiyor:
```bash
docker build -t kulasim .
```

Ardından Docker konteynerini başlatın:
```bash
docker run --env-file .env -p 8000:8000 kulasim
```
Bu komut, uygulamayı 8000 numaralı portta başlatacaktır.
