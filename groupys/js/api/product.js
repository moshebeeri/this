import store from 'react-native-simple-store';

class ProductsApi
{
    getAll() {
        return new Promise(async(resolve, reject) => {

            try {
                let token = await store.get('token');
                const response = await fetch(`${server_host}/api/products/0/10`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token

                    }

                })
                if (response.status == '401') {
                    reject(response);
                    return;
                }

                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {

                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        })


    }
    findByBusinessId(id){
        return new Promise(async(resolve, reject) => {

            try {
                let token = await store.get('token');
                const response = await fetch(`${server_host}/api/products/find/by/business/${id}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token

                    }

                })
                if (response.status == '401') {
                    reject(response);
                    return;
                }

                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {

                console.log('There has been a problem with your fetch operation: ');
                reject(error);
            }
        })    }



    getProductCategories()
    {

        let categtories = {
            "Antiques": [
                "Antiquities",
                "Architectural & Garden",
                "Asian Antiques",
                "Decorative Arts",
                "Ethnographic",
                "Home & Hearth",
                "Incunabula",
                "Linens & Textiles (Pre-1930)",
                "Manuscripts",
                "Maps, Atlases & Globes",
                "Maritime",
                "Mercantile, Trades & Factories",
                "Musical Instruments (Pre-1930)",
                "Other Antiques",
                "Periods & Styles",
                "Primitives",
                "Reproduction Antiques",
                "Restoration & Care",
                "Rugs & Carpets",
                "Science & Medicine (Pre-1930)",
                "Sewing (Pre-1930)",
                "Silver"
            ],
            "Art": [
                "Art Drawings",
                "Art Photographs",
                "Art Posters",
                "Art Prints",
                "Art Sculptures",
                "Folk Art & Indigenous Art",
                "Mixed Media Art & Collage Art",
                "Other Art",
                "Paintings",
                "Textile Art & Fiber Art"
            ],
            "Baby": [
                "Baby Gear",
                "Baby Safety & Health",
                "Bathing & Grooming",
                "Car Safety Seats",
                "Carriers, Slings & Backpacks",
                "Diapering",
                "Feeding",
                "Keepsakes & Baby Announcements",
                "Nursery Bedding",
                "Nursery Décor",
                "Nursery Furniture",
                "Other Baby",
                "Potty Training",
                "Strollers & Accessories",
                "Toys for Baby"
            ],
            "Books": [

                "Accessories",
                "Antiquarian & Collectible",
                "Audiobooks",
                "Catalogs",
                "Children & Young Adults",
                "Cookbooks",
                "Fiction & Literature",
                "Magazine Back Issues",
                "Nonfiction",
                "Other Books",
                "Textbooks, Education",
                "Wholesale & Bulk Lots"],
            "Business & Industrial": [
                "Adhesives, Sealants & Tapes",
                "Agriculture & Forestry",
                "Automation, Motors & Drives",
                "Cleaning & Janitorial Supplies",
                "Construction",
                "Electrical & Test Equipment",
                "Facility Maintenance & Safety",
                "Fasteners & Hardware",
                "Fuel & Energy",
                "Healthcare, Lab & Life Science",
                "Heavy Equipment",
                "Heavy Equipment Attachments",
                "Heavy Equipment Parts & Accs",
                "HVAC",
                "Hydraulics, Pneumatics & Pumps",
                "Light Equipment & Tools",
                "Manufacturing & Metalworking",
                "Material Handling",
                "Office",
                "Other Business & Industrial",
                "Printing & Graphic Arts",
                "Restaurant & Catering",
                "Retail & Services",
                "Websites & Businesses for Sale"],


            "Cameras & Photo": [

                "Binoculars & Telescopes",
                "Camcorders",
                "Camera & Photo Accessories",
                "Camera Drone Parts & Accs",
                "Camera Drones",
                "Camera Manuals & Guides",
                "Digital Cameras",
                "Digital Photo Frames",
                "Film Photography",
                "Flashes & Flash Accessories",
                "Lenses & Filters",
                "Lighting & Studio",
                "Other Cameras & Photo",
                "Tripods & Supports",
                "Video Production & Editing",
                "Vintage Movie & Photography"],


            "Cell Phones & Accessories": [
                "Cell Phone & Smartphone Parts",
                "Cell Phone Accessories",
                "Cell Phones & Smartphones",
                "Display Phones",
                "Other Cell Phones & Accs",
                "Phone Cards & SIM Cards",
                "Smart Watch Accessories",
                "Smart Watches",
                "Vintage Cell Phones"],


            "Clothing, Shoes & Accessories": [
                "Baby & Toddler Clothing",
                "Costumes, Reenactment, Theater",
                "Cultural & Ethnic Clothing",
                "Dancewear",
                "Kids' Clothing, Shoes & Accs",
                "Men's Accessories",
                "Men's Clothing",
                "Men's Shoes",
                "Uniforms & Work Clothing",
                "Unisex Clothing, Shoes & Accs",
                "Vintage",
                "Wedding & Formal Occasion",
                "Wholesale, Large & Small Lots",
                "Women's Accessories",
                "Women's Clothing",
                "Women's Handbags & Bags",
                "Women's Shoes"],

        }
        return categtories;

    }
}


export default ProductsApi;