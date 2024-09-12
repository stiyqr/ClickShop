const categoryElement = document.getElementById('category');
const subcategoryElement = document.getElementById('subcategory');

function removeOptions() {
    var i, L = subcategoryElement.options.length - 1;
   for(i = L; i >= 0; i--) {
      subcategoryElement.remove(i);
   }
}

async function getSubcategoryOptions() {
    removeOptions();

    const parentCategory = categoryElement.value;
    const csrfToken = categoryElement.dataset.csrf;

    let response;
    try {
        response = await fetch('/admin/products/new', {
            method: 'PATCH',
            body: JSON.stringify({
                parentCategory: parentCategory,
                _csrf: csrfToken,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        alert('Something went wrong - could not get subcategories.');
        return;
    }

    if (!response.ok) {
        alert('Something went wrong - could not get subcategories.');
        return;
    }

    const responseData = await response.json();

    let opt = document.createElement('option');
        
    opt.value = "";
    opt.text = "Choose Subcategory";
    opt.disabled = true;

    subcategoryElement.appendChild(opt);
    
    for (const subcategory of responseData.subcategories) {
        let opt = document.createElement('option');
        
        opt.value = subcategory.id;
        opt.text = subcategory.title;

        if (opt.value === subcategoryElement.dataset.originalvalue) {
            opt.selected = true;
        }

        subcategoryElement.appendChild(opt);
    }
    
}

document.addEventListener("DOMContentLoaded", getSubcategoryOptions, false);
categoryElement.addEventListener("change", getSubcategoryOptions);